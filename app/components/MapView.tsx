"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// 🔥 marker fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🚗 fake cab icon
const cabIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [30, 30],
});

type Props = {
  from: { lat: number; lon: number };
  to?: { lat: number; lon: number } | null;
  route?: any[];
  onPickupChange?: (coords: any) => void;
};

function DraggableMarker({ from, onChange }: any) {
  const [pos, setPos] = useState(from);

  useMapEvents({
    dragend: () => {},
  });

  return (
    <Marker
      draggable
      position={[pos.lat, pos.lon]}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          const newPos = { lat: latlng.lat, lon: latlng.lng };
          setPos(newPos);
          onChange && onChange(newPos);
        },
      }}
    />
  );
}

export default function MapView({
  from,
  to,
  route = [],
  onPickupChange,
}: Props) {
  const [cabs, setCabs] = useState<any[]>([]);

  // 🚗 random moving cabs
  useEffect(() => {
    const arr = Array.from({ length: 12 }).map(() => ({
      lat: from.lat + (Math.random() - 0.5) * 0.02,
      lon: from.lon + (Math.random() - 0.5) * 0.02,
    }));
    setCabs(arr);
  }, [from]);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[from.lat, from.lon]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 📍 Pickup draggable */}
        <DraggableMarker from={from} onChange={onPickupChange} />

        {/* 📍 Drop */}
        {to && <Marker position={[to.lat, to.lon]} />}

        {/* 🛣 Route */}
        {route.length > 0 && (
          <Polyline positions={route} color="#ec4899" />
        )}

        {/* 🚗 CABS */}
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