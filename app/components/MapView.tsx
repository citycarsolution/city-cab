"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 FIX MARKER ICON (VERY IMPORTANT)
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
};

export default function MapView({ from, to }: Props) {
  if (!from || !to) return null;

  const center: [number, number] = [from.lat, from.lon];

  const route: [number, number][] = [
    [from.lat, from.lon],
    [to.lat, to.lon],
  ];

  return (
    // 🔥 FINAL WRAPPER FIX
    <div className="map-wrapper mt-4">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        <Marker position={center} />
        <Marker position={[to.lat, to.lon]} />

        <Polyline positions={route} color="blue" />
      </MapContainer>
    </div>
  );
}