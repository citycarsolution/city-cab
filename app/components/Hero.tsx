"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type Mode = "rent" | "oneway" | "airport";

export default function Hero() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("oneway");
  const [pickup, setPickup] = useState("Detecting location...");
  const [drop, setDrop] = useState("");
  const [pkg, setPkg] = useState("8hr/80km");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

  // 🔥 AUTO LOCATION (GPS)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setFromCoords({ lat, lon });

        // reverse geocode (address)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();

        setPickup(data.display_name || "Current Location");
      },
      () => {
        setPickup("Mumbai"); // fallback
      }
    );

    const now = new Date();
    now.setHours(now.getHours() + 1);

    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
  }, []);

  // MODE CHANGE
  useEffect(() => {
    if (mode === "airport") setDrop("Mumbai Airport");
    if (mode === "oneway") setDrop("Pune");
    if (mode === "rent") setDrop("");
  }, [mode]);

  // 📍 GET COORDS
  const getCoords = async (place: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place + ", India"
      )}&limit=1`
    );
    const data = await res.json();

    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  };

  // 🚗 DISTANCE
  const getDistance = async (from: any, to: any) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`
    );
    const data = await res.json();
    return data.routes[0].distance / 1000;
  };

  // 💰 FARE
  const calculateFare = (km: number) => {
    return Math.round(500 + km * 12);
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      let from = fromCoords;

      if (!from) {
        from = await getCoords(pickup);
      }

      let to = from;

      if (mode !== "rent") {
        to = await getCoords(drop);
      }

      if (!from || !to) {
        alert("Location error");
        setLoading(false);
        return;
      }

      setFromCoords(from);
      setToCoords(to);

      const km = await getDistance(from, to);
      const fare = calculateFare(km);

      router.push(
        `/results?mode=${mode}&pickup=${pickup}&drop=${drop}&km=${km.toFixed(
          1
        )}&fare=${fare}&date=${date}&time=${time}&pkg=${pkg}`
      );
    } catch {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white p-5 rounded-xl w-full max-w-md">

        <h2 className="font-bold mb-3">Quick Booking</h2>

        {/* MODE */}
        <div className="flex gap-2 mb-3">
          {["rent", "oneway", "airport"].map((m: any) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded ${
                mode === m ? "bg-pink-500 text-white" : "border"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* PICKUP AUTO */}
        <input
          value={pickup}
          readOnly
          className="border w-full p-2 bg-gray-100"
        />

        {/* DROP */}
        {mode !== "rent" && (
          <input
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            className="border w-full p-2 mt-2"
          />
        )}

        {/* PACKAGE */}
        {mode === "rent" && (
          <select
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
            className="border w-full mt-2 p-2"
          >
            <option value="8hr/80km">8hr / 80km</option>
            <option value="12hr/120km">12hr / 120km</option>
          </select>
        )}

        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border w-full mt-2 p-2" />
        <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="border w-full mt-2 p-2" />

        <button
          onClick={handleSearch}
          className="w-full bg-pink-500 text-white p-3 mt-3"
        >
          {loading ? "Calculating..." : "Check Fare"}
        </button>

        {/* MAP */}
        {fromCoords && toCoords && (
          <div className="mt-4">
            <MapView from={fromCoords} to={toCoords} />
          </div>
        )}

      </div>
    </section>
  );
}