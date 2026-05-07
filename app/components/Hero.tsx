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

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();

        setPickup(data.display_name);
      },
      () => setPickup("Location not allowed")
    );
  }, []);

  // ⏱ TIME (+1 hour)
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
    <div className="relative w-full h-[100dvh] overflow-hidden">

      {/* MAP */}
      {fromCoords && (
        <div className="absolute inset-0 z-0">
          <MapView from={fromCoords} to={toCoords} route={route} />
        </div>
      )}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-0 left-0 w-full z-20 px-3 pb-20">

        <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl p-4 w-full max-w-md mx-auto max-h-[75vh] overflow-y-auto border">

          <h2 className="font-bold text-lg mb-3">Book Your Ride</h2>

          {/* MODE */}
          <div className="flex gap-2 mb-3">
            {["rent", "oneway", "airport"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as Mode)}
                className={`flex-1 py-2 rounded-xl text-sm ${
                  mode === m ? "bg-pink-500 text-white" : "border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* PICKUP */}
          <input value={pickup} readOnly className="input bg-gray-100 mb-2" />

          {/* DROP */}
          {mode !== "rent" && (
            <div className="relative mb-2">
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
                <div className="absolute bg-white border w-full z-[999] rounded-xl shadow max-h-40 overflow-y-auto">
                  {dropSug.map((item, i) => (
                    <div
                      key={i}
                      className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDrop(item.display_name);
                        setDropSug([]);
                        const to = {
                          lat: parseFloat(item.lat),
                          lon: parseFloat(item.lon),
                        };
                        setToCoords(to);
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

          {/* PACKAGE */}
          {mode === "rent" && (
            <select
              value={pkg}
              onChange={(e) => setPkg(e.target.value as any)}
              className="input mb-2"
            >
              <option>8hr / 80km</option>
              <option>12hr / 120km</option>
            </select>
          )}

          {/* TIME */}
          <input
            type="datetime-local"
            value={rideTime}
            min={rideTime}
            onChange={(e) => setRideTime(e.target.value)}
            className="input mb-2"
          />

          {/* DISTANCE */}
          {distance > 0 && mode !== "rent" && (
            <div className="text-sm text-gray-600 mb-2 flex gap-3">
              <span>🚗 {distance} km</span>
              <span>⏱ {duration} min</span>
            </div>
          )}

          {/* CARS */}
          {showCars && (
            <div className="grid grid-cols-2 gap-3">
              {cars.map((car) => {
                const price = calculateFare(distance, mode, car as any, pkg);

                return (
                  <div
                    key={car}
                    onClick={() => setSelectedCar(car)}
                    className={`bg-white border rounded-xl p-3 text-center shadow-sm transition ${
                      selectedCar === car
                        ? "border-pink-500 shadow-lg scale-105"
                        : "hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    <div className="font-semibold">{car}</div>
                    <div className="text-xs text-gray-500">
                      AC • 4+1 • 2 Bags
                    </div>
                    <div className="text-pink-500 font-bold mt-1">
                      ₹{price}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BUTTON */}
          {selectedCar && (
            <button
              onClick={() =>
                router.push(`/booking?car=${selectedCar}&mode=${mode}&price=${calculateFare(distance, mode, selectedCar as any, pkg)}&pickup=${pickup}&drop=${drop}&distance=${distance}`)
              }
              className="w-full mt-4 bg-pink-500 text-white py-3 rounded-xl font-bold"
            >
              Book {selectedCar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}