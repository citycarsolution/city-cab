"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

// =======================
// FIX LEAFLET ICON
// =======================
delete (L.Icon.Default.prototype as any)
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// =======================
// CAB ICON
// =======================
const cabIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/744/744465.png",

  iconSize: [32, 32],
});

// =======================
// USER ICON
// =======================
const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/149/149060.png",

  iconSize: [35, 35],
});

// =======================
// AIRPORT ICON
// =======================
const airportIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3097/3097144.png",

  iconSize: [35, 35],
});

// =======================
// TYPES
// =======================
type Props = {
  from: {
    lat: number;
    lon: number;
  };

  to?: {
    lat: number;
    lon: number;
  } | null;

  route?: any[];

  mode:
    | "rent"
    | "oneway"
    | "airport"
    | "roundtrip";
};

// =======================
// AUTO FIT
// =======================
function FitBounds({
  from,
  to,
}: {
  from: any;
  to: any;
}) {

  const map = useMap();

  useEffect(() => {

    if (!from) return;

    if (to) {

      map.fitBounds(
        [
          [from.lat, from.lon],
          [to.lat, to.lon],
        ],
        {
          padding: [60, 60],
        }
      );

    } else {

      map.setView(
        [from.lat, from.lon],
        13
      );
    }

  }, [from, to, map]);

  return null;
}

// =======================
// MAIN COMPONENT
// =======================
export default function MapView({
  from,
  to,
  route = [],
  mode,
}: Props) {

  const [cabs, setCabs] =
    useState<any[]>([]);

  // =======================
  // RANDOM CABS
  // =======================
  useEffect(() => {

    if (!from) return;

    const arr = Array.from({
      length: 12,
    }).map(() => ({

      lat:
        from.lat +
        (Math.random() - 0.5) *
          0.03,

      lon:
        from.lon +
        (Math.random() - 0.5) *
          0.03,
    }));

    setCabs(arr);

  }, [from]);

  // =======================
  // MAP STYLE
  // =======================
  const tileUrl = useMemo(() => {

    // RENT
    if (mode === "rent") {

      return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }

    // ONEWAY
    if (mode === "oneway") {

      return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
    }

    // ROUNDTRIP
    if (mode === "roundtrip") {

      return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }

    // AIRPORT
    return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  }, [mode]);

  // =======================
  // SAFETY
  // =======================
  if (!from) return null;

  return (

    <MapContainer

      key={`${mode}-${from?.lat}-${from?.lon}-${to?.lat}-${to?.lon}`}

      center={[
        from.lat,
        from.lon,
      ]}

      zoom={13}

      scrollWheelZoom={true}

      className="
        w-full
        h-full
        z-0
      "
    >

      {/* MAP TILE */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url={tileUrl}
      />

      {/* AUTO FIT */}
      <FitBounds
        from={from}
        to={to}
      />

      {/* USER LOCATION */}
      <Marker
        position={[
          from.lat,
          from.lon,
        ]}
        icon={userIcon}
      >

        <Popup>
          Your Current Location
        </Popup>

      </Marker>

      {/* RENT MODE */}
      {mode === "rent" &&

        cabs.map((cab, i) => (

          <Marker
            key={i}
            position={[
              cab.lat,
              cab.lon,
            ]}
            icon={cabIcon}
          >

            <Popup>
              Nearby Cab
            </Popup>

          </Marker>
        ))}

      {/* ONEWAY + ROUNDTRIP */}
      {(mode === "oneway" ||
        mode === "roundtrip") &&
        route.length > 0 && (

        <>

          {/* DESTINATION */}
          {to && (

            <Marker
              position={[
                to.lat,
                to.lon,
              ]}
            >

              <Popup>
                Destination
              </Popup>

            </Marker>
          )}

          {/* ROUTE */}
          <Polyline
            positions={route}
            pathOptions={{
              color:
                mode === "roundtrip"
                  ? "#2563eb"
                  : "#ec4899",

              weight: 6,
            }}
          />

        </>
      )}

      {/* AIRPORT */}
      {mode === "airport" &&
        route.length > 0 && (

        <>

          {/* AIRPORT */}
          {to && (

            <Marker
              position={[
                to.lat,
                to.lon,
              ]}
              icon={airportIcon}
            >

              <Popup>
                Airport
              </Popup>

            </Marker>
          )}

          {/* AIRPORT ROUTE */}
          <Polyline
            positions={route}
            pathOptions={{
              color: "#22c55e",
              weight: 6,
              dashArray: "10,10",
            }}
          />

        </>
      )}

    </MapContainer>
  );
}