"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { calculateFare } from "../utils/calculateFare";
import { pricing } from "../utils/pricing";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type Mode = "rent" | "oneway" | "airport";

export default function Hero() {
  const [mode, setMode] = useState<Mode>("oneway");

  const [pickup, setPickup] = useState("Detecting...");
  const [drop, setDrop] = useState("");
  const [dropSug, setDropSug] = useState<any[]>([]);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const [selectedCar, setSelectedCar] = useState("WagonR");

  // 📍 FAST LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setFromCoords({ lat, lon });
      setPickup("Your Location");

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        setPickup(data.display_name);
      } catch {
        setPickup("Your Location");
      }
    });
  }, []);

  // 🔍 SEARCH
  const searchPlace = async (q: string) => {
    if (q.length < 3) return setDropSug([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`
    );

    const data = await res.json();
    setDropSug(data);
  };

  // 🚗 ROUTE + FIXED DISTANCE TYPE
  const getRoute = async (from: any, to: any) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );

    const data = await res.json();
    const r = data.routes[0];

    const coords = r.geometry.coordinates.map((c: any) => [
      c[1],
      c[0],
    ]);

    setRouteCoords(coords);

    // ✅ FIX (IMPORTANT)
    setDistance(parseFloat((r.distance / 1000).toFixed(1)));
    setTime(Math.round(r.duration / 60));
  };

  // 📲 WHATSAPP BOOK
  const book = () => {
    const price = calculateFare(distance, "oneway", selectedCar);

    const msg = `
🚖 Booking

Pickup: ${pickup}
Drop: ${drop}
Car: ${selectedCar}
Distance: ${distance} KM
Time: ${time} min
Price: ₹${price}
`;

    window.open(
      `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`
    );
  };

  const cars = Object.keys(pricing.oneway.cars);

  return (
    <div className="relative h-screen w-full">

      {/* MAP */}
      {fromCoords && (
        <div className="absolute inset-0">
          <MapView
            from={fromCoords}
            to={toCoords || fromCoords}
            route={routeCoords}
          />
        </div>
      )}

      {/* CARD */}
      <div className="absolute bottom-0 w-full p-4">
        <div className="bg-white rounded-3xl p-4 shadow-xl max-w-md mx-auto">

          <h2 className="font-bold mb-2">Book Ride</h2>

          {/* SERVICE */}
          <div className="flex gap-2 mb-2">
            {["rent", "oneway", "airport"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as Mode)}
                className={`flex-1 py-2 rounded-xl ${
                  mode === m
                    ? "bg-pink-500 text-white"
                    : "border"
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
                <div className="absolute bg-white w-full border rounded shadow z-50">
                  {dropSug.map((i, idx) => (
                    <div
                      key={idx}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={async () => {
                        setDrop(i.display_name);
                        setDropSug([]);

                        const to = {
                          lat: parseFloat(i.lat),
                          lon: parseFloat(i.lon),
                        };

                        setToCoords(to);

                        if (fromCoords) {
                          await getRoute(fromCoords, to);
                        }
                      }}
                    >
                      {i.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESULT */}
          {distance > 0 && (
            <div className="bg-gray-100 p-2 rounded mt-2 text-sm">
              🚗 {distance} KM • ⏱ {time} min
            </div>
          )}

          {/* CARS */}
          <div className="mt-3 space-y-2">
            {cars.map((car) => {
              const price = calculateFare(distance, "oneway", car);

              return (
                <div
                  key={car}
                  onClick={() => setSelectedCar(car)}
                  className={`p-3 rounded-xl border flex justify-between cursor-pointer ${
                    selectedCar === car
                      ? "bg-pink-50 border-pink-500"
                      : ""
                  }`}
                >
                  <span>{car}</span>
                  <span>₹{price}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={book}
            className="w-full bg-green-500 text-white py-3 rounded-xl mt-3"
          >
            Book on WhatsApp
          </button>

        </div>
      </div>
    </div>
  );
}