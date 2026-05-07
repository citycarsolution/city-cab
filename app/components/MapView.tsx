"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// marker fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// cab icon
const cabIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [28, 28],
});

export default function MapView({ from }: any) {
  const [cabs, setCabs] = useState<any[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 10 }).map(() => ({
      lat: from.lat + (Math.random() - 0.5) * 0.02,
      lon: from.lon + (Math.random() - 0.5) * 0.02,
    }));
    setCabs(arr);
  }, [from]);

  return (
    <MapContainer
      center={[from.lat, from.lon]}
      zoom={13}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[from.lat, from.lon]} />

      {cabs.map((cab, i) => (
        <Marker
          key={i}
          position={[cab.lat, cab.lon]}
          icon={cabIcon}
        />
      ))}
    </MapContainer>
  );
}