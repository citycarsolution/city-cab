"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "../components/BookingForm";

// 🚗 CAR IMAGES
const carImages: any = {
  WagonR: "/wagonr.jpg",
  Dzire: "/dzire.png",
  Ertiga: "/ertiga.jpg",
  "Innova Crysta": "/innova.jpg",
};

// 🚖 SERVICE DATA
const serviceData: any = {
  WagonR: {
    oneWay: {
      extraKm: 13,
      extraHr: 130,
      seats: "4+1",
      bags: 1,
    },

    rent: {
      extraKm: 13,
      extraHr: 130,
      seats: "4+1",
      bags: 1,
    },

    airport: {
      extraKm: 13,
      extraHr: 130,
      seats: "4+1",
      bags: 1,
    },
  },

  Dzire: {
    oneWay: {
      extraKm: 15,
      extraHr: 150,
      seats: "4+1",
      bags: 2,
    },

    rent: {
      extraKm: 15,
      extraHr: 150,
      seats: "4+1",
      bags: 2,
    },

    airport: {
      extraKm: 15,
      extraHr: 150,
      seats: "4+1",
      bags: 2,
    },
  },

  Ertiga: {
    oneWay: {
      extraKm: 20,
      extraHr: 200,
      seats: "5+1",
      bags: 3,
    },

    rent: {
      extraKm: 20,
      extraHr: 200,
      seats: "5+1",
      bags: 3,
    },

    airport: {
      extraKm: 20,
      extraHr: 200,
      seats: "5+1",
      bags: 3,
    },
  },

  "Innova Crysta": {
    oneWay: {
      extraKm: 25,
      extraHr: 250,
      seats: "5+1",
      bags: 3,
    },

    rent: {
      extraKm: 25,
      extraHr: 250,
      seats: "5+1",
      bags: 3,
    },

    airport: {
      extraKm: 25,
      extraHr: 250,
      seats: "5+1",
      bags: 3,
    },
  },
};

export default function BookingClient() {

  const params = useSearchParams();

  // 📅 DATE + TIME
  const rawDate =
    params.get("bookingDate");

  const rawTime =
    params.get("bookingTime");

  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "N/A";

  const formattedTime = rawTime
    ? new Date(
        `1970-01-01T${rawTime}`
      ).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "N/A";

  // 🚖 URL DATA

  // =======================
// ROUNDTRIP DAYS
// =======================

const rideTime =
  params.get("rideTime");

const returnTime =
  params.get("returnTime");

let totalDays = 1;

if (
  rideTime &&
  returnTime
) {

  const start =
    new Date(rideTime);

  const end =
    new Date(returnTime);

  const diff =
    end.getTime() -
    start.getTime();

  totalDays =
    Math.ceil(
      diff /
      (1000 * 60 * 60 * 24)
    );

  if (totalDays < 1) {
    totalDays = 1;
  }
}

  const data: any = {

  car:
    params.get("car") ||
    "WagonR",

  mode:
    params.get("mode") ||
    "oneway",

  price:
    params.get("price") ||
    "0",

  pickup:
    params.get("pickup") ||
    "N/A",

  drop:
    params.get("drop") ||
    "N/A",

  distance:
    params.get("distance") ||
    "0",

  duration:
    params.get("duration") ||
    "N/A",

  bookingDate:
    formattedDate,

  bookingTime:
    formattedTime,

  pkg:
    params.get("pkg") ||
    "8hr/80km",

  // ✅ ROUNDTRIP FIX
  rideTime:
    params.get("rideTime") || "",

  returnTime:
    params.get("returnTime") || "",
};



// ✅ INNOVA FIX
if (
  data.car === "Innova"
) {
  data.car =
    "Innova Crysta";
}

  // 🚖 CURRENT SERVICE
  const currentService =
    serviceData[data.car]?.[
      data.mode === "oneway"
        ? "oneWay"
        : data.mode
    ] ||
    serviceData["WagonR"]
      .oneWay;

  return (

    <div
      className="
        min-h-screen
        bg-[#f5f5f7]
        flex
        justify-center
        items-start
        p-3
        md:p-6
      "
    >

      <div
        className="
          w-full
          max-w-md
          space-y-4
        "
      >

        {/* 🚗 CAR CARD */}
        <div
          className="
            bg-white
            rounded-[30px]
            overflow-hidden
            shadow-lg
          "
        >

          <img
            src={
              carImages[data.car] ||
              "/wagonr.jpg"
            }
            alt={data.car}
            className="
              w-full
              h-56
              object-cover
            "
          />

          <div className="p-5">

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <div>

                <h2
                  className="
                    text-[34px]
                    font-black
                    leading-none
                  "
                >
                  {data.car}
                </h2>

                <p
                  className="
                    text-gray-500
                    mt-2
                    capitalize
                  "
                >
                  {data.mode}
                  {" • "}
                  {data.distance} km
                </p>

              </div>

              <div className="text-right">

                <div
                  className="
                    text-pink-500
                    text-[46px]
                    font-black
                    leading-none
                  "
                >
                  ₹{data.price}
                </div>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  Final Fare
                </p>

              </div>

            </div>

          </div>

        </div>

       {/* ====================================== */}
{/* SERVICE DETAILS PREMIUM UI */}
{/* ====================================== */}

<div
  className="
    mt-6
    bg-white
    rounded-[32px]
    shadow-[0_10px_40px_rgba(0,0,0,0.08)]
    border
    border-pink-100
    overflow-hidden
    animate-in
    fade-in
    duration-500
  "
>

  {/* TOP BAR */}
  <div
    className="
      flex
      items-center
      justify-between
      px-5
      py-4
      border-b
      border-pink-100
      bg-gradient-to-r
      from-pink-50
      to-white
    "
  >

    <button
      onClick={() => window.history.back()}
      className="
        px-4
        py-2
        rounded-full
        bg-white
        shadow-md
        hover:scale-105
        transition
        font-semibold
        text-sm
      "
    >
      ← Back
    </button>

    <h2
      className="
        text-2xl
        font-black
        text-gray-900
      "
    >
      Service Details
    </h2>

  </div>

  <div className="p-5 space-y-5">

    {/* ============================= */}
    {/* RENT */}
    {/* ============================= */}
    {data.mode === "rent" && (

      <div
        className="
          rounded-3xl
          bg-gradient-to-br
          from-pink-500
          to-pink-400
          p-5
          text-white
          shadow-xl
          space-y-4
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-black">
              Rent Package
            </h3>

            <p className="opacity-90 text-sm">
              Premium local cab rental
            </p>

          </div>

          <div
            className="
              bg-white/20
              px-4
              py-2
              rounded-2xl
              backdrop-blur
              font-bold
            "
          >
            {data.pkg}
          </div>

        </div>

        <div
          className="
            bg-white/15
            rounded-2xl
            p-4
            space-y-2
            text-sm
          "
        >

          <p>
            📦 Package:
            {" "}
            {data.pkg}
          </p>

          <p>

            🚘 Included:

            {" "}

            {data.pkg ===
            "8hr/80km"
              ? "8 Hours / 80km"
              : "12 Hours / 120km"}

          </p>

          <p>

            ➕ Extra KM:

            {" ₹"}

            {data.car ===
            "WagonR"
              ? 13
              : data.car ===
                "Dzire"
              ? 15
              : data.car ===
                "Ertiga"
              ? 18
              : 23}

            /km

          </p>
           
           <p>

  ⏰ Extra Hour:

  {" ₹"}

  {data.car ===
  "WagonR"
    ? 130
    : data.car ===
      "Dzire"
    ? 150
    : data.car ===
      "Ertiga"
    ? 180
    : 230}

  /hr

</p>
        </div>

      </div>
    )}

    {/* ============================= */}
{/* ONEWAY */}
{/* ============================= */}
{data.mode === "oneway" && (

  <div
    className="
      rounded-3xl
      bg-gradient-to-br
      from-pink-500
      to-rose-400
      p-5
      text-white
      shadow-xl
      space-y-4
      hover:scale-[1.01]
      transition-all
      duration-300
    "
  >

    <div>

      <h3 className="text-2xl font-black">
        Oneway Ride
      </h3>

      <p className="opacity-90 text-sm">
        Fast & affordable intercity
      </p>

    </div>

    <div
      className="
        bg-white/15
        rounded-2xl
        p-4
        space-y-3
        text-sm
        backdrop-blur
      "
    >

      <p>
        🚖 ETA:
        {" "}
        {data.duration}
      </p>

      <p>

        📍 Billable km:
        {" "}

        {Math.max(
          100,
          Math.round(
            Number(data.distance)
          )
        )}

        {" "}
        (min 100)

        {" = ₹"}

        {data.car ===
        "WagonR"
          ? 1800
          : data.car ===
            "Dzire"
          ? 2000
          : data.car ===
            "Ertiga"
          ? 2750
          : 4250}

      </p>

      <p>

        ➕ Extra km:

        {" "}

        {Math.max(
          0,
          Number(data.distance) - 100
        ).toFixed(1)}

        {" × ₹"}

        {data.car ===
        "WagonR"
          ? 13
          : data.car ===
            "Dzire"
          ? 15
          : data.car ===
            "Ertiga"
          ? 20
          : 25}

        {" = ₹"}

        {Math.round(

          Math.max(
            0,
            Number(data.distance) - 100
          ) *

          (
            data.car ===
            "WagonR"
              ? 13
              : data.car ===
                "Dzire"
              ? 15
              : data.car ===
                "Ertiga"
              ? 20
              : 25
          )

        )}

      </p>

    </div>

  </div>
)}

    {/* ============================= */}
    {/* AIRPORT */}
    {/* ============================= */}
    {data.mode === "airport" && (

      <div
        className="
          rounded-3xl
          bg-gradient-to-br
          from-pink-500
          to-fuchsia-500
          p-5
          text-white
          shadow-xl
          space-y-4
        "
      >

        <div>

          <h3 className="text-2xl font-black">
            Airport Transfer
          </h3>

          <p className="opacity-90 text-sm">
            Comfortable airport pickup/drop
          </p>

        </div>

        <div
          className="
            bg-white/15
            rounded-2xl
            p-4
            text-sm
            space-y-3
          "
        >

          <p>

            {data.car ===
            "Innova Crysta"
              ? "Base 40km (4h/40km)"
              : "Base 10km"}

            {" • Extra ₹"}

            {data.car ===
            "WagonR"
              ? 13
              : data.car ===
                "Dzire"
              ? 15
              : data.car ===
                "Ertiga"
              ? 20
              : 25}

            /km

          </p>

          <p>

            {data.car ===
            "Innova Crysta"
              ? "After 4h: ₹5/min"
              : data.car ===
                "Ertiga"
              ? "After 60m: ₹3.5/min"
              : "After 60m: ₹2.5/min"}

          </p>

          <p>
            🚖 ETA:
            {" "}
            {data.duration}
          </p>

          <p>
            🧾 Tolls/Parking extra
            at actuals
          </p>

        </div>

      </div>
    )}

    {/* ============================= */}
{/* ROUNDTRIP */}
{/* ============================= */}
{data.mode === "roundtrip" && (() => {

  const perKm =
    data.car === "WagonR"
      ? 12
      : data.car === "Dzire"
      ? 13
      : data.car === "Ertiga"
      ? 17
      : 23;

  const actualKm = Math.round(
    Number(data.distance) * 2
  );

  // DAYS CALCULATION
  const start = new Date(data.rideTime);
  const end = new Date(data.returnTime);

  const diff =
    end.getTime() -
    start.getTime();

  const totalDays = Math.max(
    1,
    Math.ceil(
      diff /
        (1000 * 60 * 60 * 24)
    )
  );

  // BILLABLE
  const billableKm =
    300 * totalDays;

  const kmCharges =
    billableKm * perKm;

  const driverAllowance =
    500 * totalDays;

  return (

    <div
      className="
        rounded-3xl
        bg-gradient-to-br
        from-pink-500
        via-fuchsia-500
        to-purple-500
        p-5
        text-white
        shadow-2xl
        space-y-4
        hover:scale-[1.01]
        transition-all
        duration-300
      "
    >

      <div>

        <h3 className="text-3xl font-black">
          Roundtrip Package
        </h3>

        <p className="opacity-90 text-sm">
          Multi-day outstation rides
        </p>

      </div>

      <div
        className="
          bg-white/15
          backdrop-blur-xl
          rounded-3xl
          p-5
          space-y-4
          border
          border-white/20
        "
      >

        <p className="font-bold text-lg">

          Min 300km/day • ₹{perKm}/km • Driver ₹500/day

        </p>

        <div className="space-y-3 text-[15px]">

          <p>
            📅 Days:
            {" "}
            {totalDays}
          </p>

          <p>
            📍 Actual km:
            {" "}
            {actualKm}
          </p>

          <p>
            🚖 Billable km:
            {" "}
            {billableKm}
          </p>

          <p>
            💰 Kilometer charges:
            {" "}
            ₹{kmCharges}
          </p>

          <p>
            👨‍✈ Driver allowance:
            {" "}
            ₹{driverAllowance}
          </p>

        </div>

      </div>

      {/* INCLUSIONS */}
      <div
        className="
          bg-green-50
          text-black
          rounded-3xl
          p-5
          space-y-3
        "
      >

        <h4 className="font-black text-xl">
          Inclusions
        </h4>

        <p>
          ✔ Professional driver & clean A.C. cab
        </p>

        <p>
          ✔ Base package / base km as per service
        </p>

        <p>
          ✔ GST included if applicable
        </p>

      </div>

      {/* EXCLUSIONS */}
      <div
        className="
          bg-red-50
          text-black
          rounded-3xl
          p-5
          space-y-3
        "
      >

        <h4 className="font-black text-xl">
          Exclusions
        </h4>

        <p>
          ✘ Toll, Parking, Inter-state entry tax
        </p>

        <p>
          ✘ Extra km/hr beyond base limits
        </p>

        <p>
          ✘ Night charges / Driver allowance when applicable
        </p>

      </div>

    </div>
  );

})()}

    {/* ============================= */}
    {/* COMMON */}
    {/* ============================= */}

    <div
      className="
        rounded-3xl
        border
        border-green-100
        bg-green-50
        p-5
      "
    >

      <h3
        className="
          text-xl
          font-black
          text-green-700
          mb-4
        "
      >
        ✔ Inclusions
      </h3>

      <div className="space-y-3 text-gray-700">

        <p>
          Professional driver &
          clean A.C. cab
        </p>

        <p>
          Base package / base km
          as per service
        </p>

        <p>
          GST included if applicable
        </p>

      </div>

    </div>

    <div
      className="
        rounded-3xl
        border
        border-red-100
        bg-red-50
        p-5
      "
    >

      <h3
        className="
          text-xl
          font-black
          text-red-600
          mb-4
        "
      >
        ✘ Exclusions
      </h3>

      <div className="space-y-3 text-gray-700">

        <p>
          Toll, Parking,
          Inter-state entry tax
        </p>

        <p>
          Extra km/hr beyond
          base limits
        </p>

        <p>
          Night charges /
          Driver allowance
        </p>

      </div>

    </div>

  </div>

</div>

        {/* 👤 BOOKING FORM */}
        <BookingForm data={data} />

      </div>

    </div>
  );
}