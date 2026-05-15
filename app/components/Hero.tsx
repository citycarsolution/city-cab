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
  | "airport"
  | "roundtrip";

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

const [showSuggestions, setShowSuggestions] =
  useState(false);

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

const [returnTime, setReturnTime] =
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
// USER LOCATION
// =======================
useEffect(() => {

  const getUserLocation = async () => {

    if (!navigator.geolocation) {

      setPickup(
        "Geolocation not supported"
      );

      return;
    }

    // LOCATION PERMISSION
try {

  const permission =
    await navigator.permissions.query({
      name: "geolocation",
    });

  if (
    permission.state === "denied"
  ) {

    alert(
      "Please enable location access for better cab booking experience."
    );

    setPickup(
      "Enable location access"
    );

    return;
  }

} catch (err) {

  console.log(err);
}

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

  `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=69eca1b5532c483991038b8fa49f62d2`

);

const data =
  await res.json();

if (
  data.features &&
  data.features.length > 0
) {

  setPickup(

    data.features[0]
      .properties
      .formatted
  );

} else {

  setPickup(
    "Current Location"
  );
}

} catch {

  setPickup(
    "Current Location"
  );
}
},

(err) => {

  console.log(err);

  setPickup(
    "Enable location access"
  );
},

{
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
}
);
};

  // DIRECT POPUP
  getUserLocation();

  // DEFAULT TIME
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

// =======================
// REALISTIC MUMBAI TRAFFIC TIME
// =======================
const trafficMultiplier =
  km > 100
    ? 1.6
    : km > 50
    ? 1.45
    : 1.3;

// DURATION
const totalMinutes =
  Math.ceil(
    (
      r.duration / 60
    ) * trafficMultiplier
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
        "Mumbai Airport (BOM) - International Terminal"
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
    setShowSuggestions(true);

    if (
      value.trim().length < 2
    ) {

      setSuggestions([]);
      return;
    }

    try {

     const res = await fetch(

  `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    value
  )}&limit=6&filter=countrycode:in&apiKey=69eca1b5532c483991038b8fa49f62d2`

);

const data =
  await res.json();

setSuggestions(
  data.features || []
);

} catch (err) {

  console.log(err);
}
};

// =======================
// SELECT SUGGESTION
// =======================
const selectSuggestion = async (
  suggestion: any
) => {

  const name =
    suggestion.properties.formatted;

  const lat =
    suggestion.properties.lat;

  const lon =
    suggestion.properties.lon;

  setDrop(name);

  setSuggestions([]);

  setShowSuggestions(false);

  const toCoord = {
    lat,
    lon,
  };

  setToCoords(toCoord);

  if (fromCoords) {

    await getRoute(
      fromCoords,
      toCoord
    );
  }
};

  // =======================
  // BOOKING
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
    pkg,
    rideTime,
    returnTime
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.suggestions-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (

    <section className="relative min-h-screen overflow-hidden">

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
          min-h-screen
          max-w-7xl
          mx-auto
          px-3
          sm:px-4
          flex
          items-center
          py-10
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

          </div>

          {/* RIGHT */}
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
                rounded-[30px]
                p-4
                shadow-2xl
              "
            >

              {/* HEADER */}
              <div className="mb-5">

                <h2
                  className="
                    text-3xl
                    font-black
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
                  grid-cols-4
                  gap-3
                  mb-4
                "
              >

                {[
                  "rent",
                  "oneway",
                  "airport",
                  "roundtrip",
                   ].map((m) => (

                  <button
                    key={m}
                    onClick={() => {

                      setMode(
                        m as Mode
                      );

                      setDrop("");

                      setSuggestions([]);
                      setShowSuggestions(false);
                      setSelectedCar("");
                      setDistance(0);
                      setDuration("");
                      setToCoords(null);
                      setRoute([]);
                    }}
                    className={`
                      h-12
                      rounded-2xl
                      font-semibold
                      capitalize

                      ${
                        mode === m
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
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

              {/* RENT / ONEWAY / AIRPORT */}
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

              <div className="relative mb-3 suggestions-container z-[9999]">  

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
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={
                        mode === "airport" 
                          ? "Airport will be auto-set" 
                          : "Enter drop location"
                      }
                      readOnly={mode === "airport"}
                      className="
                        bg-transparent
                        w-full
                        outline-none
                        text-sm
                      "
                    />

                  </div>
{/* SUGGESTIONS DROPDOWN */}
{showSuggestions && mode !== "airport" && suggestions.length > 0 && (
  <div className="absolute z-[9999] w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-y-auto pointer-events-auto">
    {suggestions.map((s, idx) => (
      <div
        key={idx}
        onMouseDown={() => selectSuggestion(s)}
        className="px-4 py-2 hover:bg-pink-50 cursor-pointer flex items-start gap-2 border-b border-gray-100 last:border-0"
      >
        <MapPin size={16} className="text-pink-500 mt-0.5 flex-shrink-0" />

        <span className="text-sm text-gray-700">
          {s.properties.formatted}
        </span>

      </div>
    ))}
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
              {/* RETURN DATE */}
{mode === "roundtrip" && (

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
      className="text-blue-500"
    />

    <input
      type="datetime-local"
      value={returnTime}
      onChange={(e) =>
        setReturnTime(
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
)}

              {/* DISTANCE & DURATION - NOW SHOWS FOR ONEWAY AND AIRPORT */}
              {distance > 0 && mode !== "rent" && (

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
                  sm:grid-cols-4
                  gap-2
                  mt-4
                "
              >

                {cars.map((car) => {
const price =
  calculateFare(
    distance,
    mode,
    car as any,
    pkg,
    rideTime,
    returnTime
  );
                  let seats = "4+1";
                  let bags = 1;

                  let displayName = car;

                  // DZIRE
                  if (car === "Dzire") {
                    bags = 2;
                  }

                  // ERTIGA
                  if (car === "Ertiga") {
                    seats = "5+1";
                    bags = 3;
                  }

                  // INNOVA
                  if (car === "Innova") {

                    displayName =
                      "Innova Crysta";

                    seats = "5+1";

                    bags = 3;
                  }

                  return (

                    <div
                      key={car}
                      onClick={() =>
                        setSelectedCar(car)
                      }
                      className={`
                        rounded-[18px]
                        border
                        p-3
                        text-center
                        cursor-pointer
                        transition-all
                        min-h-[120px]
                        flex
                        flex-col
                        justify-center

                        ${
                          selectedCar === car
                            ? "border-pink-500 bg-pink-50 shadow-md"
                            : "border-gray-200 bg-white"
                        }
                      `}
                    >

                      {/* CAR NAME */}
                      <h3
                        className="
                          font-bold
                          text-[16px]
                          leading-tight
                        "
                      >
                        {displayName}
                      </h3>

                      {/* DETAILS */}
                      <p
                        className="
                          text-[10px]
                          text-gray-500
                          mt-1
                          leading-tight
                        "
                      >
                        AC • {seats} • {bags} Bags
                      </p>

                      {/* PRICE */}
                      <div
                        className="
                          text-pink-500
                          text-[20px]
                          font-black
                          mt-2
                          leading-none
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
                    h-11
                    rounded-2xl
                    mt-4
                    font-bold
                    text-white
                    bg-gradient-to-r
                    from-pink-500
                    to-rose-500
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