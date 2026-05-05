"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
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

// 🚗 cab icon
const cabIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [28, 28],
});

type Props = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  route: any[];
};

export default function MapView({ from, to, route }: Props) {
  const [cabs, setCabs] = useState<any[]>([]);

  // 🚗 fake cab animation
  useEffect(() => {
    if (!from) return;

    const generate = () => {
      const temp: any[] = [];

      for (let i = 0; i < 12; i++) {
        temp.push({
          lat: from.lat + (Math.random() - 0.5) * 0.02,
          lon: from.lon + (Math.random() - 0.5) * 0.02,
        });
      }

      setCabs(temp);
    };

    generate();
    const i = setInterval(generate, 4000);

    return () => clearInterval(i);
  }, [from]);

  const center: [number, number] = [from.lat, from.lon];

  return (
    <div className="w-full h-screen">
      <MapContainer center={center} zoom={13} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* user */}
        <Marker position={[from.lat, from.lon]} />

        {/* drop */}
        {to && <Marker position={[to.lat, to.lon]} />}

        {/* route */}
        {route.length > 0 && (
          <Polyline positions={route} color="#ec4899" />
        )}

        {/* cabs */}
        {cabs.map((c, i) => (
          <Marker
            key={i}
            position={[c.lat, c.lon]}
            icon={cabIcon}
          />
        ))}
      </MapContainer>
    </div>
  );
}