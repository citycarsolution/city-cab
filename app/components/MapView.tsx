"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// 🔥 FIX MARKER
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Props = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  route?: any[];
};

// 🔥 AUTO CENTER + FIT ROUTE
function ChangeView({ from, to, route }: any) {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 0) {
      map.fitBounds(route);
    } else {
      map.setView([from.lat, from.lon], 13);
    }
  }, [from, to, route, map]);

  return null;
}

export default function MapView({ from, to, route = [] }: Props) {
  if (!from || !to) return null;

  const fallbackRoute: [number, number][] = [
    [from.lat, from.lon],
    [to.lat, to.lon],
  ];

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[from.lat, from.lon]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* 🔥 AUTO VIEW */}
        <ChangeView from={from} to={to} route={route} />

        {/* MARKERS */}
        <Marker position={[from.lat, from.lon]} />
        <Marker position={[to.lat, to.lon]} />

        {/* 🔥 REAL ROUTE */}
        <Polyline
          positions={route.length ? route : fallbackRoute}
          color="#ec4899"
          weight={5}
        />
      </MapContainer>
    </div>
  );
}