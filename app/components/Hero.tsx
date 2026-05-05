"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type Mode = "rent" | "oneway" | "airport";

export default function Hero() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("oneway");
  const [pickup, setPickup] = useState("Detecting...");
  const [drop, setDrop] = useState("");
  const [dropSug, setDropSug] = useState<any[]>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

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

    const now = new Date();
    now.setHours(now.getHours() + 1);
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
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

  // 🚗 ROUTE + TIME
  const getRoute = async (from: any, to: any) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    return {
      km: data.routes[0].distance / 1000,
      time: data.routes[0].duration / 60,
    };
  };

  const handleSearch = async () => {
    setLoading(true);

    const to = toCoords;

    if (!fromCoords || !to) {
      alert("Select valid location");
      setLoading(false);
      return;
    }

    const route = await getRoute(fromCoords, to);

    router.push(
      `/results?mode=${mode}&pickup=${pickup}&drop=${drop}&km=${route.km.toFixed(
        1
      )}&time=${route.time.toFixed(0)}`
    );

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

        {/* PICKUP */}
        <input
          value={pickup}
          readOnly
          className="border w-full p-2 bg-gray-100"
        />

        {/* DROP AUTOCOMPLETE */}
        <div className="relative mt-2">
          <input
            value={drop}
            onChange={(e) => {
              setDrop(e.target.value);
              searchPlace(e.target.value);
            }}
            placeholder="Enter Drop"
            className="border w-full p-2"
          />

          {dropSug.length > 0 && (
            <div className="absolute bg-white border w-full max-h-40 overflow-auto z-50">
              {dropSug.map((item, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDrop(item.display_name);
                    setDropSug([]);

                    setToCoords({
                      lat: parseFloat(item.lat),
                      lon: parseFloat(item.lon),
                    });
                  }}
                >
                  {item.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

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