"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function Hero() {
  const [pickup, setPickup] = useState("Detecting...");
  const [drop, setDrop] = useState("");
  const [dropSug, setDropSug] = useState<any[]>([]);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

  const [routeCoords, setRouteCoords] = useState<any[]>([]);

  // 📍 AUTO LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setFromCoords({ lat, lon });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setPickup(data.display_name);
    });
  }, []);

  // 🔍 AUTOCOMPLETE
  const searchPlace = async (q: string) => {
    if (q.length < 3) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q + ", India"
      )}&limit=5`
    );

    const data = await res.json();
    setDropSug(data);
  };

  // 🚗 REAL ROUTE (OSRM)
  const getRoute = async (from: any, to: any) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );

    const data = await res.json();

    const coords = data.routes[0].geometry.coordinates.map(
      (c: any) => [c[1], c[0]]
    );

    setRouteCoords(coords);
  };

  return (
    <div className="relative h-screen w-full">

      {/* 🔥 FULL MAP */}
      {fromCoords && (
        <div className="absolute inset-0 z-0">
          <MapView
            from={fromCoords}
            to={toCoords || fromCoords}
            route={routeCoords}
          />
        </div>
      )}

      {/* 🔥 FLOATING CARD */}
      <div className="absolute bottom-0 w-full p-4 z-10">
        <div className="bg-white rounded-2xl p-4 shadow-2xl">

          <h2 className="font-bold text-lg mb-3">Book Your Ride</h2>

          {/* PICKUP */}
          <input
            value={pickup}
            readOnly
            className="input bg-gray-100"
          />

          {/* DROP */}
          <div className="relative">
            <input
              value={drop}
              onChange={(e) => {
                setDrop(e.target.value);
                searchPlace(e.target.value);
              }}
              placeholder="Enter Drop Location"
              className="input"
            />

            {dropSug.length > 0 && (
              <div className="absolute bg-white border w-full max-h-40 overflow-auto z-50 rounded-lg shadow">
                {dropSug.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={async () => {
                      setDrop(item.display_name);
                      setDropSug([]);

                      const to = {
                        lat: parseFloat(item.lat),
                        lon: parseFloat(item.lon),
                      };

                      setToCoords(to);

                      // 🔥 CALL ROUTE
                      if (fromCoords) {
                        await getRoute(fromCoords, to);
                      }
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-pink-500 text-white py-3 rounded-xl mt-2">
            Check Fare
          </button>

        </div>
      </div>

    </div>
  );
}