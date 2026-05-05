"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// 🔥 Marker fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🚖 CAB ICON
const cabIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
  iconSize: [28, 28],
});

type Props = {
  from: any;
  to: any;
  route: any[];
  onPickupChange: (coords: any) => void;
};

export default function MapView({
  from,
  to,
  route,
  onPickupChange,
}: Props) {
  const [cabs, setCabs] = useState<any[]>([]);

  // 🚖 CREATE RANDOM CABS
  useEffect(() => {
    if (!from) return;

    const arr = Array.from({ length: 8 }).map(() => ({
      lat: from.lat + (Math.random() - 0.5) * 0.02,
      lon: from.lon + (Math.random() - 0.5) * 0.02,
    }));

    setCabs(arr);
  }, [from]);

  // 🚖 MOVE CABS (LIVE)
  useEffect(() => {
    const interval = setInterval(() => {
      setCabs((prev) =>
        prev.map((cab) => ({
          lat: cab.lat + (Math.random() - 0.5) * 0.001,
          lon: cab.lon + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!from) return null;

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[from.lat, from.lon]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 📍 DRAGGABLE PICKUP */}
        <Marker
          position={[from.lat, from.lon]}
          draggable
          eventHandlers={{
            dragend: (e: any) => {
              const latlng = e.target.getLatLng();
              onPickupChange({ lat: latlng.lat, lon: latlng.lng });
            },
          }}
        />

        {/* 📍 DROP */}
        {to && <Marker position={[to.lat, to.lon]} />}

        {/* 🛣 ROUTE */}
        {route.length > 0 && (
          <Polyline positions={route} color="#ec4899" />
        )}

        {/* 🚖 LIVE CABS */}
        {cabs.map((cab, i) => (
          <Marker
            key={i}
            position={[cab.lat, cab.lon]}
            icon={cabIcon}
          />
        ))}
      </MapContainer>
    </div>
  );
}