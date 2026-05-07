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
  // GET USER LOCATION
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

        try {

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          const data =
            await res.json();

          setPickup(
            data.display_name
          );

        } catch {

          setPickup(
            "Current Location"
          );
        }
      },

      () => {

        setPickup(
          "Location access denied"
        );
      }
    );

    // =======================
    // DEFAULT BOOKING TIME
    // =======================
    const now = new Date();

    now.setHours(
      now.getHours() + 1
    );

    const formatted =
      new Date(
        now.getTime() -
          now.getTimezoneOffset() *
            60000
      )
        .toISOString()
        .slice(0, 16);

    setRideTime(formatted);

  }, []);

  // =======================
  // ROUTE API
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

      // DISTANCE
      const km =
        Number(
          (
            r.distance / 1000
          ).toFixed(1)
        );

      setDistance(km);

      // DURATION
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

      // ROUTE
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
  // SEARCH LOCATION
  // =======================
  const searchLocation = async (
    value: string
  ) => {

    setDrop(value);

    if (
      value.trim().length < 2
    ) {

      setSuggestions([]);

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

  // =======================
  // BOOK NOW
  // =======================
  const handleBooking = () => {

    if (!selectedCar) {

      alert(
        "Please select cab"
      );

      return;
    }

    const price =
      calculateFare(
        distance,
        mode,
        selectedCar as any,
        pkg
      );

    const bookingDate =
      rideTime.split("T")[0];

    const bookingTime =
      rideTime.split("T")[1];

    router.push(

      `/booking

      ?car=${encodeURIComponent(
        selectedCar
      )}

      &mode=${encodeURIComponent(
        mode
      )}

      &price=${price}

      &pickup=${encodeURIComponent(
        pickup
      )}

      &drop=${encodeURIComponent(
        drop || "N/A"
      )}

      &distance=${distance}

      &duration=${encodeURIComponent(
        duration || "N/A"
      )}

      &bookingDate=${encodeURIComponent(
        bookingDate
      )}

      &bookingTime=${encodeURIComponent(
        bookingTime
      )}`

        .replace(/\s+/g, "")
    );
  };

  return (

    <section className="relative h-screen overflow-hidden">

      {/* MAP */}
      {fromCoords && (

        <div className="absolute inset-0">

          <MapView
            from={fromCoords}
            to={toCoords}
            route={route}
            mode={mode}
          />

          <div className="absolute inset-0 bg-black/45 z-[1]" />
        </div>
      )}

      {/* CONTENT */}
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

          {/* LEFT */}
          <div className="hidden lg:block text-white">

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-white/10
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
                leading-8
                max-w-xl
              "
            >
              Book city rides,
              airport transfers
              and outstation trips
              with real-time map tracking.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div
            className="
              w-full
              max-w-xl
              lg:ml-auto
            "
          >

            <div
              className="
                bg-white/92
                backdrop-blur-xl
                rounded-[32px]
                p-5
                shadow-2xl
              "
            >

              {/* HEADER */}
              <div className="mb-5">

                <h2
                  className="
                    text-3xl
                    font-black
                    mb-1
                  "
                >
                  Book Your Ride
                </h2>

                <p className="text-gray-500">
                  Premium cab booking experience
                </p>
              </div>

              {/* MODES */}
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

                      setSuggestions([]);

                      setSelectedCar("");

                      setDistance(0);

                      setDuration("");
                    }}
                    className={`
                      h-12
                      rounded-2xl
                      font-semibold
                      capitalize
                      transition-all

                      ${
                        mode === m
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                          : "bg-gray-100"
                      }
                    `}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* PICKUP */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  h-12
                  px-4
                  rounded-2xl
                  bg-gray-100
                  mb-3
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

              {/* RENT / DROP */}
              {mode === "rent" ? (

                <select
                  value={pkg}
                  onChange={(e) =>
                    setPkg(
                      e.target.value as any
                    )
                  }
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-2xl
                    bg-gray-100
                    outline-none
                    text-sm
                    mb-3
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

                <div className="relative mb-3">

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      h-12
                      px-4
                      rounded-2xl
                      bg-gray-100
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
                        mode === "airport"
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

                  {/* SUGGESTIONS */}
                  {suggestions.length > 0 && (

                    <div
                      className="
                        absolute
                        top-full
                        left-0
                        right-0
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        mt-2
                        overflow-hidden
                        z-50
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

                              setSuggestions([]);

                              const destination = {
                                lat: Number(item.lat),
                                lon: Number(item.lon),
                              };

                              setToCoords(destination);

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
                            {item.display_name}
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
                  h-12
                  px-4
                  rounded-2xl
                  bg-gray-100
                  mb-4
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
                    text-sm
                  "
                />
              </div>

              {/* DISTANCE */}
              {distance > 0 &&
                mode !== "rent" && (

                <div
                  className="
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
                    mb-4
                  "
                >
                  🚗 {distance} km • ⏱ {duration}
                </div>
              )}

              {/* CARS */}
              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-4
                  gap-3
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
                        setSelectedCar(car)
                      }
                      className={`
                        rounded-2xl
                        border
                        p-3
                        text-center
                        cursor-pointer
                        transition-all

                        ${
                          selectedCar === car
                            ? "border-pink-500 bg-pink-50 shadow-lg"
                            : "border-gray-200 bg-white"
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
                          text-xs
                          text-gray-500
                          mt-1
                        "
                      >
                        AC • 4+1 • 2 Bags
                      </p>

                      <div
                        className="
                          text-pink-500
                          text-2xl
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

              {/* BUTTON */}
              {selectedCar && (

                <button
                  onClick={handleBooking}
                  className="
                    w-full
                    h-12
                    rounded-2xl
                    mt-5
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