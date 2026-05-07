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

  const [pkg, setPkg] = useState<"8hr/80km" | "12hr/120km">("8hr/80km");
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const [rideTime, setRideTime] = useState("");

  // 📍 LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setFromCoords({ lat, lon });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          setPickup(data.display_name || "Current Location");
        } catch {
          setPickup("Current Location");
        }
      },
      () => setPickup("Location not allowed"),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // ⏱ TIME
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setRideTime(now.toISOString().slice(0, 16));
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
    setDuration(Math.round(r.duration / 60));

    const coords = r.geometry.coordinates.map((c: any) => [c[1], c[0]]);
    setRoute(coords);
  };

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
    <div className="relative w-full h-[100dvh] overflow-hidden">

      {/* MAP */}
      {fromCoords && (
        <div className="absolute inset-0 z-0">
          <MapView from={fromCoords} to={toCoords} route={route} />
        </div>
      )}

      {/* BOTTOM SHEET */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white rounded-t-3xl p-4 shadow-2xl max-h-[75dvh] overflow-y-auto pb-32">

          <h2 className="font-bold text-lg mb-3">Book Your Ride</h2>

          {/* MODE */}
          <div className="flex gap-2 mb-3">
            {["rent", "oneway", "airport"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m as Mode);
                  setSelectedCar(null);
                  setDrop("");
                  setToCoords(null);
                  setRoute([]);
                }}
                className={`flex-1 py-2 rounded-lg ${
                  mode === m ? "bg-pink-500 text-white" : "border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <input value={pickup} readOnly className="input bg-gray-100" />

          {mode !== "rent" && (
            <input
              value={drop}
              onChange={(e) => {
                setDrop(e.target.value);
                searchPlace(e.target.value);
              }}
              placeholder="Enter Drop Location"
              className="input"
            />
          )}

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

          <input
            type="datetime-local"
            value={rideTime}
            onChange={(e) => setRideTime(e.target.value)}
            className="input"
          />

          {/* CAR GRID */}
          {showCars && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {cars.map((car) => {
                const price = calculateFare(distance, mode, car as any, pkg);
                const isActive = selectedCar === car;

                return (
                  <div
                    key={car}
                    onClick={() => setSelectedCar(car)}
                    className={`border rounded-2xl p-4 text-center bg-white
                      ${
                        isActive
                          ? "border-pink-500 shadow-md"
                          : "border-gray-300"
                      }`}
                  >
                    <div className="font-semibold">{car}</div>
                    <div className="text-xs text-gray-500">
                      AC • 4+1 • 2 Bags
                    </div>
                    <div className="text-pink-500 font-bold mt-2 text-lg">
                      ₹{price}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* 🔥 FIXED BUTTON */}
      {selectedCar && (
        <div className="fixed bottom-16 left-0 right-0 px-4 z-[60]">
          <button
            onClick={() => {
              const price = calculateFare(
                distance,
                mode,
                selectedCar as any,
                pkg
              );
              router.push(`/booking?car=${selectedCar}&price=${price}`);
            }}
            className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold shadow-lg"
          >
            Book {selectedCar}
          </button>
        </div>
      )}
    </div>
  );
}