"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

type Props = {
  from: any;
  to: any;
};

export default function MapView({ from, to }: Props) {
  if (!from || !to) return null;

  const center = [from.lat, from.lon];

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

      {/* Pickup Marker */}
      <Marker position={[from.lat, from.lon]} />

      {/* Drop Marker */}
      <Marker position={[to.lat, to.lon]} />

      {/* Route Line */}
      <Polyline
        positions={[
          [from.lat, from.lon],
          [to.lat, to.lon],
        ]}
        color="blue"
      />
    </MapContainer>
  );
}