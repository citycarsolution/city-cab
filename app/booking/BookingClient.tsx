"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "../components/BookingForm";

// 🚗 CAR IMAGE MAP
const carImages: any = {
  WagonR: "/wagonr.jpg",
  Dzire: "/dzire.png",
  Ertiga: "/ertiga.jpg",
  Innova: "/innova.jpg",
  Crysta: "/innova.jpg",
};

// 📊 SERVICE DATA
const serviceData: any = {

  WagonR: {
    oneWay: {
      extraKm: 13,
      extraHr: 130,
      seats: "4+1",
      bags: 2,
    },

    rent: {
      extraKm: 13,
      extraHr: 130,
      seats: "4+1",
      bags: 2,
    },

    airport: {
      extraKm: 13,
      extraHr: 130,
      seats: "4+1",
      bags: 2,
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
      seats: "6+1",
      bags: 3,
    },

    rent: {
      extraKm: 20,
      extraHr: 200,
      seats: "6+1",
      bags: 3,
    },

    airport: {
      extraKm: 20,
      extraHr: 200,
      seats: "6+1",
      bags: 3,
    },
  },

  Innova: {
    oneWay: {
      extraKm: 25,
      extraHr: 250,
      seats: "6+1",
      bags: 4,
    },

    rent: {
      extraKm: 25,
      extraHr: 250,
      seats: "6+1",
      bags: 4,
    },

    airport: {
      extraKm: 25,
      extraHr: 250,
      seats: "6+1",
      bags: 4,
    },
  },
};

export default function BookingClient() {

  const params =
    useSearchParams();

  // =========================
  // RAW URL DATA
  // =========================
  const rawDate =
    params.get("bookingDate");

  const rawTime =
    params.get("bookingTime");

  // =========================
  // FORMAT DATE
  // =========================
  const formattedDate =
    rawDate

      ? new Date(rawDate)
          .toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )

      : "N/A";

  // =========================
  // FORMAT TIME
  // =========================
  const formattedTime =
    rawTime

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

  // =========================
  // FINAL DATA
  // =========================
  const data = {

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
  };

  // =========================
  // CURRENT SERVICE
  // =========================
  const currentService =

    serviceData[data.car]?.[
      data.mode === "oneway"
        ? "oneWay"
        : data.mode
    ]

    ||

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
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          md:max-w-lg
          lg:max-w-xl
          space-y-4
        "
      >

        {/* 🚗 CAR CARD */}
        <div
          className="
            bg-white
            rounded-[28px]
            shadow-xl
            overflow-hidden
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
              h-48
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
                    text-2xl
                    font-black
                  "
                >
                  {data.car}
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                    capitalize
                  "
                >
                  {data.mode}
                  {" • "}
                  {data.distance} km
                </p>

              </div>

              <div
                className="
                  text-right
                "
              >

                <div
                  className="
                    text-3xl
                    font-black
                    text-pink-500
                  "
                >
                  ₹{data.price}
                </div>

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  Final Fare
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* 📊 SERVICE CARD */}
        <div
          className="
            bg-white
            rounded-[28px]
            shadow
            p-5
            text-sm
            space-y-2
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-2
            "
          >
            Service Details
          </h3>

          <p>
            ✔ Extra KM:
            ₹{currentService.extraKm}/km
          </p>

          <p>
            ✔ Extra Hour:
            ₹{currentService.extraHr}/hr
          </p>

          <p>
            ✔ Toll / Parking:
            Extra
          </p>

          <p className="text-gray-500">
            AC •{" "}
            {currentService.seats}
            {" • "}
            {currentService.bags}
            {" Bags"}
          </p>

        </div>

        {/* 📍 RIDE DETAILS */}
        <div
          className="
            bg-white
            rounded-[28px]
            shadow
            p-5
            text-sm
            space-y-4
          "
        >

          <h3
            className="
              text-xl
              font-bold
            "
          >
            Ride Details
          </h3>

          {/* PICKUP */}
          <div>

            <p className="font-semibold">
              Pickup
            </p>

            <p
              className="
                text-gray-600
                text-sm
                break-words
              "
            >
              {data.pickup}
            </p>

          </div>

          {/* DROP */}
          <div>

            <p className="font-semibold">
              Drop
            </p>

            <p
              className="
                text-gray-600
                text-sm
                break-words
              "
            >
              {data.drop}
            </p>

          </div>

          {/* DATE & TIME */}
          <div
            className="
              grid
              grid-cols-2
              gap-4
            "
          >

            <div>

              <p className="font-semibold">
                Date
              </p>

              <p
                className="
                  text-gray-600
                  text-sm
                "
              >
                {data.bookingDate}
              </p>

            </div>

            <div>

              <p className="font-semibold">
                Time
              </p>

              <p
                className="
                  text-gray-600
                  text-sm
                "
              >
                {data.bookingTime}
              </p>

            </div>

          </div>

          {/* DISTANCE */}
          <div>

            <p className="font-semibold">
              Route
            </p>

            <p
              className="
                text-pink-500
                text-sm
              "
            >
              🚖 {data.distance} km
              {" • "}
              {data.duration}
            </p>

          </div>

        </div>

        {/* 👤 FORM */}
        <BookingForm
          data={data}
        />

      </div>
    </div>
  );
}