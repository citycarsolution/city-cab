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
// MAP
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

  const [suggestions, setSuggestions] =
    useState<any[]>([]);

  const [fromCoords, setFromCoords] =
    useState<any>(null);

  const [toCoords, setToCoords] =
    useState<any>(null);

  const [route, setRoute] =
    useState<any[]>([]);

  const [distance, setDistance] =
    useState(0);

  const [duration, setDuration] =
    useState("");

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

    // =======================
    // INDIA CURRENT TIME +1 HOUR
    // =======================
    const now = new Date();

    const indiaTime =
      new Date(
        now.toLocaleString(
          "en-US",
          {
            timeZone:
              "Asia/Kolkata",
          }
        )
      );

    indiaTime.setHours(
      indiaTime.getHours() + 1
    );

    const formatted =
      new Date(
        indiaTime.getTime() -
          indiaTime.getTimezoneOffset() *
            60000
      )
        .toISOString()
        .slice(0, 16);

    setRideTime(formatted);

  }, []);

  // =======================
  // GET ROUTE
  // =======================
  const getRoute = async (
    from: any,
    to: any
  ) => {

    try {

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
      );

      const data =
        await res.json();

      const r =
        data.routes?.[0];

      if (!r) return;

      // =======================
      // DISTANCE
      // =======================
      setDistance(
        Number(
          (
            r.distance / 1000
          ).toFixed(1)
        )
      );

      // =======================
      // DURATION
      // =======================
      const totalMinutes =
        Math.ceil(
          r.duration / 60
        );

      const hours =
        Math.floor(
          totalMinutes / 60
        );

      const minutes =
        totalMinutes % 60;

      if (hours > 0) {

        setDuration(
          `${hours} hr ${minutes} min`
        );

      } else {

        setDuration(
          `${minutes} min`
        );
      }

      // =======================
      // ROUTE LINE
      // =======================
      setRoute(
        r.geometry.coordinates.map(
          (c: any) => [
            c[1],
            c[0],
          ]
        )
      );

    } catch (err) {

      console.log(err);
    }
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
  // SEARCH CITY
  // =======================
  const searchLocation = async (
    value: string
  ) => {

    setDrop(value);

    if (
      value.trim().length < 2
    ) {

      setSuggestions([]);

      setDistance(0);

      setDuration("");

      setRoute([]);

      return;
    }

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&countrycodes=in&limit=5`
      );

      const data =
        await res.json();

      setSuggestions(data);

    } catch (err) {

      console.log(err);
    }
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
            gap-8
            items-center
            w-full
          "
        >

          {/* ===================
              LEFT SIDE
          =================== */}
          <div className="hidden lg:block text-white">

            {/* badge */}
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

            {/* title */}
            <h1
              className="
                text-5xl
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

            {/* subtitle */}
            <p
              className="
                mt-6
                text-lg
                text-white/70
                max-w-xl
                leading-8
              "
            >
              Book city rides,
              airport transfers
              and outstation trips
              with real-time map
              tracking and premium
              cab experience.
            </p>

            {/* stats */}
            <div
              className="
                flex
                gap-8
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
              max-w-xl
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
                p-4
                md:p-5
              "
            >

              {/* heading */}
              <div className="mb-4">

                <h2
                  className="
                    text-2xl
                    md:text-3xl
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

              {/* ===================
                  MODE BUTTONS
              =================== */}
              <div
                className="
                  grid
                  grid-cols-3
                  gap-3
                  mb-4
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

                      setSuggestions(
                        []
                      );

                      setToCoords(
                        null
                      );

                      setRoute([]);

                      setDistance(0);

                      setDuration("");

                      setSelectedCar(
                        ""
                      );
                    }}
                    className={`
                      h-11
                      rounded-2xl
                      font-semibold
                      capitalize
                      transition-all
                      duration-300

                      ${
                        mode === m
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200"
                      }
                    `}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* ===================
                  FORM
              =================== */}
              <div className="space-y-3">

                {/* pickup */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    h-11
                    px-4
                    rounded-2xl
                    bg-gray-100/80
                  "
                >

                  <MapPin
                    size={16}
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

                {/* RENT PACKAGE */}
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
                      h-11
                      px-4
                      rounded-2xl
                      bg-gray-100/80
                      outline-none
                      text-sm
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

                  <div className="relative">

                    {/* input */}
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        h-11
                        px-4
                        rounded-2xl
                        bg-gray-100/80
                        border
                        border-pink-200
                        focus-within:border-pink-500
                        focus-within:bg-white
                        transition-all
                      "
                    >

                      <MapPin
                        size={16}
                        className="text-pink-500"
                      />

                      <input
                        value={drop}
                        onChange={(e) =>
                          searchLocation(
                            e.target
                              .value
                          )
                        }
                        placeholder={
                          mode ===
                          "airport"
                            ? "Mumbai Airport"
                            : "Search city"
                        }
                        className="
                          bg-transparent
                          w-full
                          outline-none
                          text-sm
                        "
                      />
                    </div>

                    {/* suggestions */}
                    {suggestions.length >
                      0 && (

                      <div
                        className="
                          absolute
                          top-full
                          left-0
                          right-0
                          bg-white
                          border
                          rounded-2xl
                          shadow-2xl
                          mt-2
                          overflow-hidden
                          z-50
                          max-h-60
                          overflow-y-auto
                        "
                      >

                        {suggestions.map(
                          (
                            item: any,
                            index
                          ) => (

                            <button
                              key={index}
                              onClick={() => {

                                setDrop(
                                  item.display_name
                                );

                                setSuggestions(
                                  []
                                );

                                const destination =
                                  {

                                    lat: Number(
                                      item.lat
                                    ),

                                    lon: Number(
                                      item.lon
                                    ),
                                  };

                                setToCoords(
                                  destination
                                );

                                getRoute(
                                  fromCoords,
                                  destination
                                );
                              }}
                              className="
                                w-full
                                text-left
                                px-4
                                py-3
                                hover:bg-pink-50
                                border-b
                                text-sm
                              "
                            >
                              {
                                item.display_name
                              }
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* DATE */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    h-11
                    px-4
                    rounded-2xl
                    bg-gray-100/80
                  "
                >

                  <CalendarDays
                    size={16}
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
                      text-sm
                    "
                  />
                </div>
              </div>

              {/* ===================
                  DISTANCE + TIME
              =================== */}
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
                    px-3
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  🚗 {distance} km •
                  ⏱ {duration}
                </div>
              )}

              {/* ===================
                  CARS
              =================== */}
              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-4
                  gap-3
                  mt-5
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
                        rounded-[22px]
                        border
                        border-gray-200
                        bg-white
                        p-3
                        text-center
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:shadow-xl
                        hover:border-pink-300

                        ${
                          selectedCar ===
                          car
                            ? "border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-xl"
                            : ""
                        }
                      `}
                    >

                      <h3
                        className="
                          font-bold
                          text-base
                        "
                      >
                        {car}
                      </h3>

                      <p
                        className="
                          text-[11px]
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
                          text-xl
                          font-black
                          mt-2
                        "
                      >
                        ₹{price}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* ===================
                  BUTTON
              =================== */}
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
                    h-11
                    mt-5
                    rounded-2xl
                    font-bold
                    text-white
                    bg-gradient-to-r
                    from-pink-500
                    to-rose-500
                    hover:scale-[1.01]
                    transition-all
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