"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { calculateFare } from "../utils/calculateFare";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type Mode = "rent" | "oneway" | "airport";

export default function Hero() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("rent");

  const [pickup, setPickup] = useState("Detecting...");
  const [drop, setDrop] = useState("");
  const [dropSug, setDropSug] = useState<any[]>([]);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [route, setRoute] = useState<any[]>([]);

  const [rideTime, setRideTime] = useState("");

  // 📍 LOCATION (fast)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setFromCoords({ lat, lon });
        setPickup("Your Location");

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        setPickup(data.display_name);
      },
      () => setPickup("Location not allowed"),
      { enableHighAccuracy: true }
    );
  }, []);

  // ⏱ TIME (1 hour future)
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setRideTime(now.toISOString().slice(0, 16));
  }, []);

  // 🔍 SEARCH
  const searchPlace = async (q: string) => {
    if (q.length < 3) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`
    );

    const data = await res.json();
    setDropSug(data);
  };

  // 🚗 ROUTE + TIME FIXED
  const getRoute = async (from: any, to: any) => {
    if (!from || !to) return;

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );

    const data = await res.json();
    const r = data.routes?.[0];

    if (!r) return;

    // ✅ FIXED (no type error)
    const km = r.distance / 1000;
    setDistance(Math.round(km * 10) / 10);

    setDuration(Math.round(r.duration / 60));

    const coords = r.geometry.coordinates.map((c: any) => [c[1], c[0]]);
    setRoute(coords);
  };

  // ✈️ AIRPORT AUTO
  useEffect(() => {
    if (mode === "airport" && fromCoords) {
      const airport = { lat: 19.0896, lon: 72.8656 };

      setDrop("Mumbai Airport");
      setToCoords(airport);

      getRoute(fromCoords, airport);
    }
  }, [mode, fromCoords]);

  // 🛑 RENT RESET
  useEffect(() => {
    if (mode === "rent") {
      setToCoords(null);
      setRoute([]);
      setDistance(0);
      setDuration(0);
    }
  }, [mode]);

  return (
    <div className="relative h-screen">

      {/* 🗺 MAP */}
      {fromCoords && (
        <MapView from={fromCoords} to={toCoords} route={route} />
      )}

      {/* 📦 CARD */}
      <div className="absolute bottom-0 w-full p-3 z-10">
        <div className="bg-white rounded-2xl p-4 shadow-xl max-h-[75vh] overflow-auto">

          <h2 className="font-bold text-lg mb-2">Book Your Ride</h2>

          {/* MODE */}
          <div className="flex gap-2 mb-2">
            {["rent", "oneway", "airport"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as Mode)}
                className={`flex-1 py-2 rounded-lg ${
                  mode === m ? "bg-pink-500 text-white" : "border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* PICKUP */}
          <input value={pickup} readOnly className="input bg-gray-100" />

          {/* DROP */}
          {mode !== "rent" && (
            <div className="relative">
              <input
                value={drop}
                onChange={(e) => {
                  setDrop(e.target.value);
                  searchPlace(e.target.value);
                }}
                placeholder="Enter Drop"
                className="input"
              />

              {dropSug.length > 0 && (
                <div className="absolute z-50 bg-white border w-full rounded-xl shadow max-h-40 overflow-auto">
                  {dropSug.map((item, i) => (
                    <div
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const to = {
                          lat: parseFloat(item.lat),
                          lon: parseFloat(item.lon),
                        };

                        setDrop(item.display_name);
                        setToCoords(to);
                        setDropSug([]);

                        getRoute(fromCoords, to);
                      }}
                    >
                      {item.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ⏱ TIME */}
          <input
            type="datetime-local"
            value={rideTime}
            min={rideTime}
            onChange={(e) => setRideTime(e.target.value)}
            className="input mt-2"
          />

          {/* 📏 DISTANCE + TIME */}
          {distance > 0 && (
            <div className="text-sm text-gray-600 mt-2 flex gap-3">
              <span>🚗 {distance} km</span>
              <span>⏱ {duration} min</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}