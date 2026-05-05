"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

type Props = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
};

export default function MapView({ from, to }: Props) {
  if (!from || !to) return null;

  // ✅ FIXED TYPE
  const center: [number, number] = [from.lat, from.lon];

  const route: [number, number][] = [
    [from.lat, from.lon],
    [to.lat, to.lon],
  ];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={center} />
      <Marker position={[to.lat, to.lon]} />

      <Polyline positions={route} color="blue" />
    </MapContainer>
  );
}