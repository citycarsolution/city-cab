"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { calculateFare } from "../utils/calculateFare";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

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
      () => setPickup("Location not allowed"),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  }, []);

  // ⏰ TIME
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
      const airport = {
        lat: 19.0896,
        lon: 72.8656,
      };

      setDrop("Mumbai Airport");

      setToCoords(airport);

      getRoute(fromCoords, airport);
    }
  }, [mode, fromCoords]);

  const cars = ["WagonR", "Dzire", "Ertiga", "Innova"];

  const showCars = mode === "rent" || !!toCoords;

  // 🗺️ MAP HEIGHT
  const mapHeight =
    mode === "rent"
      ? "h-[42vh] md:h-[55vh]"
      : "h-[48vh] md:h-[60vh]";

  return (
    <section className="relative bg-gray-100 min-h-screen overflow-hidden">

      {/* MAP */}
      <div className={`relative w-full ${mapHeight}`}>
        {fromCoords && (
          <MapView
            from={fromCoords}
            to={toCoords}
            route={route}
            mode={mode}
          />
        )}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/10 z-[1]" />
      </div>

      {/* CARD */}
      <div className="relative z-10 -mt-10 md:-mt-16 px-3 md:px-6 pb-24">

        <div
          className="
          bg-white
          rounded-[28px]
          shadow-2xl
          p-4
          md:p-6
          max-w-7xl
          mx-auto
          border
        "
        >

          {/* TITLE */}
          <h2 className="text-2xl font-bold mb-5">
            Book Your Ride
          </h2>

          {/* SERVICE BUTTONS */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">

            {["rent", "oneway", "airport"].map((m) => (

              <button
                key={m}
                onClick={() => {
                  setMode(m as Mode);

                  setDrop("");

                  setToCoords(null);

                  setRoute([]);

                  setDistance(0);

                  setDuration(0);

                  setSelectedCar(null);
                }}
                className={`
                py-3
                rounded-xl
                font-semibold
                capitalize
                transition-all
                duration-300
                border

                ${
                  mode === m
                    ? "bg-pink-500 text-white border-pink-500 shadow-lg"
                    : "bg-white hover:bg-pink-50"
                }
              `}
              >
                {m}
              </button>
            ))}
          </div>

          {/* FORM */}
          <div className="space-y-3">

            {/* PICKUP */}
            <input
              value={pickup}
              readOnly
              className="
                w-full
                border
                rounded-xl
                px-4
                py-4
                bg-gray-50
                outline-none
                text-sm
              "
            />

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
                  className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-4
                    outline-none
                    text-sm
                  "
                />

                {dropSug.length > 0 && (
                  <div className="
                    absolute
                    bg-white
                    border
                    w-full
                    max-h-52
                    overflow-auto
                    rounded-xl
                    shadow-xl
                    z-50
                    mt-1
                  ">
                    {dropSug.map((item, i) => (
                      <div
                        key={i}
                        className="
                          p-3
                          hover:bg-pink-50
                          cursor-pointer
                          text-sm
                          border-b
                        "
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
                onChange={(e) =>
                  setPkg(e.target.value as any)
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-4
                  bg-white
                  outline-none
                "
              >
                <option value="8hr/80km">
                  8hr / 80km
                </option>

                <option value="12hr/120km">
                  12hr / 120km
                </option>
              </select>
            )}

            {/* TIME */}
            <input
              type="datetime-local"
              value={rideTime}
              min={rideTime}
              onChange={(e) =>
                setRideTime(e.target.value)
              }
              className="
                w-full
                border
                rounded-xl
                px-4
                py-4
                outline-none
              "
            />
          </div>

          {/* DISTANCE */}
          {distance > 0 && mode !== "rent" && (
            <div className="
              flex
              gap-4
              mt-4
              text-sm
              text-gray-600
              font-medium
            ">
              <span>🚗 {distance} km</span>

              <span>⏱ {duration} min</span>
            </div>
          )}

          {/* CARS */}
          {showCars && (
            <div className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mt-6
            ">

              {cars.map((car) => {

                const price = calculateFare(
                  distance,
                  mode,
                  car as any,
                  pkg
                );

                const isActive =
                  selectedCar === car;

                return (
                  <div
                    key={car}
                    onClick={() =>
                      setSelectedCar(car)
                    }
                    className={`
                      border
                      rounded-2xl
                      p-4
                      text-center
                      cursor-pointer
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "border-pink-500 shadow-2xl scale-105 bg-pink-50"
                          : "hover:shadow-xl hover:-translate-y-1"
                      }
                    `}
                  >

                    <div className="font-bold text-lg">
                      {car}
                    </div>

                    <div className="
                      text-sm
                      text-gray-500
                      mt-1
                    ">
                      AC • 4+1 • 2 Bags
                    </div>

                    <div className="
                      text-pink-500
                      font-bold
                      text-3xl
                      mt-3
                    ">
                      ₹{price}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BOOK BUTTON */}
          {selectedCar && (
            <button
              onClick={() => {

                const price = calculateFare(
                  distance,
                  mode,
                  selectedCar as any,
                  pkg
                );

                router.push(
                  `/booking?car=${selectedCar}&mode=${mode}&price=${price}&pickup=${encodeURIComponent(
                    pickup
                  )}&drop=${encodeURIComponent(
                    drop
                  )}&distance=${distance}`
                );
              }}
              className="
                w-full
                mt-6
                bg-pink-500
                hover:bg-pink-600
                text-white
                py-4
                rounded-2xl
                font-bold
                text-lg
                shadow-xl
                transition-all
              "
            >
              Book {selectedCar}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}