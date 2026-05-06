"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { calculateFare } from "../utils/calculateFare";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type Mode = "rent" | "oneway" | "airport";

export default function Hero() {
  const [mode, setMode] = useState<Mode>("rent");

  const [pickup, setPickup] = useState("Detecting...");
  const [drop, setDrop] = useState("");
  const [dropSug, setDropSug] = useState<any[]>([]);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

  const [distance, setDistance] = useState(0);
  const [route, setRoute] = useState<any[]>([]);

  const [pkg, setPkg] = useState<"8hr/80km" | "12hr/120km">("8hr/80km");

  // 🔥 NEW: selected car
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  // 📍 LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setFromCoords({ lat, lon });

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();

        setPickup(data.display_name);
      },
      () => setPickup("Location not allowed"),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // 🔍 SEARCH
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

  // 🚗 ROUTE
  const getRoute = async (from: any, to: any) => {
    if (!from || !to) return;

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );

    const data = await res.json();
    const r = data.routes?.[0];
    if (!r) return;

    setDistance(Number((r.distance / 1000).toFixed(1)));

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

  const cars = ["WagonR", "Dzire", "Ertiga", "Innova"];

  const showCars = mode === "rent" || !!toCoords;

  return (
    <div className="relative h-screen">

      {/* MAP */}
      {fromCoords && (
        <div className="absolute inset-0 z-0">
          <MapView
            from={fromCoords}
            to={toCoords}
            route={route}
          />
        </div>
      )}

      {/* CARD */}
      <div className="absolute bottom-0 w-full p-3 z-10">
        <div className="bg-white rounded-2xl p-4 shadow-xl max-h-[80vh] overflow-auto">

          <h2 className="font-bold text-lg mb-2">Book Your Ride</h2>

          {/* MODE */}
          <div className="flex gap-2 mb-2">
            {["rent", "oneway", "airport"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m as Mode);
                  setDrop("");
                  setToCoords(null);
                  setRoute([]);
                  setDistance(0);
                  setSelectedCar(null);
                }}
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
          )}

          {/* RENT PACKAGE */}
          {mode === "rent" && (
            <select
              value={pkg}
              onChange={(e) => setPkg(e.target.value as any)}
              className="input"
            >
              <option value="8hr/80km">8hr / 80km</option>
              <option value="12hr/120km">12hr / 120km</option>
            </select>
          )}

          {/* DISTANCE */}
          {distance > 0 && mode !== "rent" && (
            <div className="text-sm text-gray-600 mb-2">
              🚗 {distance} km
            </div>
          )}

          {/* 🚗 CAR GRID */}
          {showCars && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {cars.map((car) => {
                const price = calculateFare(distance, mode, car as any, pkg);
                const isActive = selectedCar === car;

                return (
                  <div
                    key={car}
                    onClick={() => setSelectedCar(car)}
                    className={`cursor-pointer border rounded-xl p-3 text-center transition duration-200
                      ${isActive
                        ? "border-pink-500 shadow-lg scale-105"
                        : "hover:shadow-lg hover:scale-105"
                      }`}
                  >
                    <div className="font-semibold text-sm">{car}</div>

                    <div className="text-xs text-gray-500">
                      AC • 4+1 • 2 Bags
                    </div>

                    <div className="text-pink-500 font-bold mt-1 text-lg">
                      ₹{price}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🔥 BOOK BUTTON */}
          {selectedCar && (
            <button className="w-full mt-4 bg-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg">
              Book {selectedCar}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}