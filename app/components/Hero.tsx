"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CalendarDays,
  Car,
} from "lucide-react";

import { calculateFare } from "../utils/calculateFare";

// =======================
// MAP IMPORT
// =======================
const MapView = dynamic(
  () => import("./MapView"),
  {
    ssr: false,
  }
);

// =======================
// TYPES
// =======================
type Mode =
  | "rent"
  | "oneway"
  | "airport";

export default function Hero() {

  const router = useRouter();

  // =======================
  // STATES
  // =======================
  const [mode, setMode] =
    useState<Mode>("rent");

  const [pickup, setPickup] =
    useState("Detecting location...");

  const [drop, setDrop] =
    useState("");

  const [fromCoords, setFromCoords] =
    useState<any>(null);

  const [toCoords, setToCoords] =
    useState<any>(null);

  const [route, setRoute] =
    useState<any[]>([]);

  const [distance, setDistance] =
    useState(0);

  const [rideTime, setRideTime] =
    useState("");

  const [selectedCar, setSelectedCar] =
    useState("");

  const [pkg, setPkg] = useState<
    "8hr/80km" | "12hr/120km"
  >("8hr/80km");

  // =======================
  // CARS
  // =======================
  const cars = [
    "WagonR",
    "Dzire",
    "Ertiga",
    "Innova",
  ];

  // =======================
  // GET LOCATION
  // =======================
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      async (pos) => {

        const lat =
          pos.coords.latitude;

        const lon =
          pos.coords.longitude;

        setFromCoords({
          lat,
          lon,
        });

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data =
          await res.json();

        setPickup(
          data.display_name
        );
      },

      () => {
        setPickup(
          "Location access denied"
        );
      }
    );

    const now = new Date();

    now.setHours(
      now.getHours() + 1
    );

    setRideTime(
      now.toISOString().slice(0, 16)
    );

  }, []);

  // =======================
  // GET ROUTE
  // =======================
  const getRoute = async (
    from: any,
    to: any
  ) => {

    if (!from || !to) return;

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );

    const data =
      await res.json();

    const r =
      data.routes?.[0];

    if (!r) return;

    setDistance(
      Number(
        (r.distance / 1000).toFixed(1)
      )
    );

    setRoute(
      r.geometry.coordinates.map(
        (c: any) => [c[1], c[0]]
      )
    );
  };

  // =======================
  // AIRPORT AUTO
  // =======================
  useEffect(() => {

    if (
      mode === "airport" &&
      fromCoords
    ) {

      const airport = {
        lat: 19.0896,
        lon: 72.8656,
      };

      setDrop(
        "Mumbai Airport"
      );

      setToCoords(airport);

      getRoute(
        fromCoords,
        airport
      );
    }

  }, [mode, fromCoords]);

  // =======================
  // SEARCH LOCATION
  // =======================
  const searchLocation =
    async (value: string) => {

      setDrop(value);

      if (value.length < 3)
        return;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value + ", India"
        )}&limit=1`
      );

      const data =
        await res.json();

      if (!data[0]) return;

      const to = {
        lat: parseFloat(
          data[0].lat
        ),

        lon: parseFloat(
          data[0].lon
        ),
      };

      setToCoords(to);

      getRoute(
        fromCoords,
        to
      );
    };

  return (

    <section className="relative h-screen overflow-hidden">

      {/* ===================
          MAP
      =================== */}
      {fromCoords && (

        <div className="absolute inset-0">

          <MapView
            from={fromCoords}
            to={toCoords}
            route={route}
            mode={mode}
          />

          {/* overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-black/30
              to-black/10
              z-[1]
            "
          />
        </div>
      )}

      {/* ===================
          CONTENT
      =================== */}
      <div
        className="
          relative
          z-20
          h-full
          max-w-7xl
          mx-auto
          px-4
          flex
          items-center
        "
      >

        <div
          className="
            grid
            lg:grid-cols-2
            gap-12
            items-center
            w-full
          "
        >

          {/* ===================
              LEFT CONTENT
          =================== */}
          <div className="hidden lg:block text-white">

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
                px-5
                py-2
                rounded-full
                mb-6
              "
            >
              <Car size={18} />

              <span className="text-sm">
                Premium Cab Booking
              </span>
            </div>

            <h1
              className="
                text-6xl
                font-black
                leading-tight
              "
            >
              Ride Smarter
              <br />

              <span
                className="
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-pink-400
                  to-rose-500
                "
              >
                Travel Better
              </span>
            </h1>

            <p
              className="
                mt-6
                text-lg
                text-white/70
                max-w-xl
                leading-8
              "
            >
              Book city rides, airport
              transfers and outstation
              trips with real-time map
              tracking and premium cab
              experience.
            </p>

            {/* stats */}
            <div
              className="
                flex
                gap-10
                mt-10
              "
            >

              <div>
                <h3
                  className="
                    text-4xl
                    font-bold
                  "
                >
                  500+
                </h3>

                <p className="text-white/60">
                  Daily Trips
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-4xl
                    font-bold
                  "
                >
                  24/7
                </h3>

                <p className="text-white/60">
                  Live Support
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-4xl
                    font-bold
                  "
                >
                  100%
                </h3>

                <p className="text-white/60">
                  Safe Ride
                </p>
              </div>

            </div>
          </div>

          {/* ===================
              BOOKING CARD
          =================== */}
          <div
            className="
              w-full
              max-w-2xl
              lg:ml-auto
            "
          >

            <div
              className="
                bg-white/90
                backdrop-blur-2xl
                border
                border-white/20
                rounded-[32px]
                shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                p-5
                md:p-6
              "
            >

              {/* title */}
              <div className="mb-5">

                <h2
                  className="
                    text-3xl
                    md:text-4xl
                    font-black
                    tracking-tight
                    mb-1
                  "
                >
                  Book Your Ride
                </h2>

                <p className="text-gray-500">
                  Premium cab booking
                  experience
                </p>
              </div>

              {/* mode buttons */}
              <div
                className="
                  grid
                  grid-cols-3
                  gap-3
                  mb-5
                "
              >

                {[
                  "rent",
                  "oneway",
                  "airport",
                ].map((m) => (

                  <button
                    key={m}
                    onClick={() => {

                      setMode(
                        m as Mode
                      );

                      setDrop("");

                      setToCoords(
                        null
                      );

                      setRoute([]);

                      setDistance(0);

                      setSelectedCar(
                        ""
                      );
                    }}
                    className={`
                      h-12
                      rounded-2xl
                      font-semibold
                      capitalize
                      transition-all
                      duration-300

                      ${
                        mode === m
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-[1.02]"
                          : "bg-gray-100 hover:bg-gray-200"
                      }
                    `}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* form */}
              <div className="space-y-4">

                {/* pickup */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    h-14
                    px-5
                    rounded-2xl
                    bg-gray-100/80
                    border
                    border-transparent
                    focus-within:border-pink-500
                    focus-within:bg-white
                    focus-within:shadow-lg
                    transition-all
                  "
                >

                  <MapPin
                    size={18}
                    className="text-pink-500"
                  />

                  <input
                    value={pickup}
                    readOnly
                    className="
                      bg-transparent
                      w-full
                      outline-none
                      text-sm
                    "
                  />
                </div>

                {/* rent package */}
                {mode === "rent" ? (

                  <select
                    value={pkg}
                    onChange={(e) =>
                      setPkg(
                        e.target
                          .value as any
                      )
                    }
                    className="
                      w-full
                      h-14
                      px-5
                      rounded-2xl
                      bg-gray-100/80
                      border
                      border-transparent
                      outline-none
                      transition-all
                      focus:border-pink-500
                      focus:bg-white
                      focus:shadow-lg
                    "
                  >

                    <option value="8hr/80km">
                      8hr / 80km
                    </option>

                    <option value="12hr/120km">
                      12hr / 120km
                    </option>

                  </select>

                ) : (

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      h-14
                      px-5
                      rounded-2xl
                      bg-gray-100/80
                      border
                      border-transparent
                      focus-within:border-pink-500
                      focus-within:bg-white
                      focus-within:shadow-lg
                      transition-all
                    "
                  >

                    <MapPin
                      size={18}
                      className="text-pink-500"
                    />

                    <input
                      value={drop}
                      onChange={(e) =>
                        searchLocation(
                          e.target.value
                        )
                      }
                      placeholder={
                        mode ===
                        "airport"
                          ? "Mumbai Airport"
                          : "Enter destination"
                      }
                      className="
                        bg-transparent
                        w-full
                        outline-none
                        text-sm
                      "
                    />
                  </div>
                )}

                {/* date */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    h-14
                    px-5
                    rounded-2xl
                    bg-gray-100/80
                    border
                    border-transparent
                    focus-within:border-pink-500
                    focus-within:bg-white
                    focus-within:shadow-lg
                    transition-all
                  "
                >

                  <CalendarDays
                    size={18}
                    className="text-pink-500"
                  />

                  <input
                    type="datetime-local"
                    value={rideTime}
                    onChange={(e) =>
                      setRideTime(
                        e.target.value
                      )
                    }
                    className="
                      bg-transparent
                      w-full
                      outline-none
                    "
                  />
                </div>
              </div>

              {/* distance */}
              {distance > 0 &&
                mode !== "rent" && (

                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    bg-pink-50
                    text-pink-600
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  🚗 {distance} km route
                </div>
              )}

              {/* cars */}
              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-4
                  gap-4
                  mt-6
                "
              >

                {cars.map((car) => {

                  const price =
                    calculateFare(
                      distance,
                      mode,
                      car as any,
                      pkg
                    );

                  return (

                    <div
                      key={car}
                      onClick={() =>
                        setSelectedCar(
                          car
                        )
                      }
                      className={`
                        rounded-[24px]
                        border
                        border-gray-200
                        bg-white
                        p-4
                        text-center
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:shadow-2xl
                        hover:-translate-y-1
                        hover:border-pink-300

                        ${
                          selectedCar ===
                          car
                            ? "border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-xl scale-[1.02]"
                            : ""
                        }
                      `}
                    >

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        {car}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-gray-500
                          mt-1
                        "
                      >
                        AC • 4+1 • 2 Bags
                      </p>

                      <div
                        className="
                          text-transparent
                          bg-clip-text
                          bg-gradient-to-r
                          from-pink-500
                          to-rose-500
                          text-2xl
                          font-black
                          mt-3
                        "
                      >
                        ₹{price}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* button */}
              {selectedCar && (

                <button
                  onClick={() => {

                    const price =
                      calculateFare(
                        distance,
                        mode,
                        selectedCar as any,
                        pkg
                      );

                    router.push(
                      `/booking?car=${selectedCar}&mode=${mode}&price=${price}`
                    );
                  }}
                  className="
                    w-full
                    h-14
                    mt-6
                    rounded-2xl
                    font-bold
                    text-white
                    bg-gradient-to-r
                    from-pink-500
                    to-rose-500
                    hover:scale-[1.01]
                    hover:shadow-2xl
                    transition-all
                    duration-300
                  "
                >
                  Book {selectedCar}
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}