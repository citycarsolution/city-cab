"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// 🔥 MARKER FIX
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🚗 CAB ICON
const cabIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [30, 30],
});

type Props = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  route: any[];
};

export default function MapView({ from, to, route }: Props) {
  const [cabs, setCabs] = useState<any[]>([]);

  // 🔥 GENERATE RANDOM CABS
  useEffect(() => {
    if (!from) return;

    const generateCabs = () => {
      let temp: any[] = [];

      for (let i = 0; i < 15; i++) {
        temp.push({
          lat: from.lat + (Math.random() - 0.5) * 0.02,
          lon: from.lon + (Math.random() - 0.5) * 0.02,
        });
      }

      setCabs(temp);
    };

    generateCabs();

    // 🔥 MOVE CABS (animation feel)
    const interval = setInterval(generateCabs, 4000);

    return () => clearInterval(interval);
  }, [from]);

  const center: [number, number] = [from.lat, from.lon];

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 📍 USER */}
        <Marker position={[from.lat, from.lon]} />

        {/* 📍 DESTINATION */}
        {to && <Marker position={[to.lat, to.lon]} />}

        {/* 🚗 ROUTE */}
        {route.length > 0 && (
          <Polyline positions={route} color="#ec4899" />
        )}

        {/* 🚗 LIVE CABS */}
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