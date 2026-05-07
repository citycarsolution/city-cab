"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "../components/BookingForm";

// 🚗 CAR IMAGE MAP
const carImages: any = {
  WagonR: "/wagonr.jpg",
  Dzire: "/dzire.png",
  Ertiga: "/ertiga.jpg",
  Innova: "/innova.jpg",
};

// 📊 SERVICE DATA (car wise)
const serviceData: any = {
  WagonR: {
    oneWay: { extraKm: 13, extraHr: 130, seats: "4+1", bags: 2 },
    rent: { extraKm: 13, extraHr: 130, seats: "4+1", bags: 2 },
    airport: { extraKm: 13, extraHr: 130, seats: "4+1", bags: 2 },
  },
  Dzire: {
    oneWay: { extraKm: 15, extraHr: 150, seats: "4+1", bags: 2 },
    rent: { extraKm: 15, extraHr: 150, seats: "4+1", bags: 2 },
    airport: { extraKm: 15, extraHr: 150, seats: "4+1", bags: 2 },
  },
  Ertiga: {
    oneWay: { extraKm: 20, extraHr: 200, seats: "6+1", bags: 3 },
    rent: { extraKm: 20, extraHr: 200, seats: "6+1", bags: 3 },
    airport: { extraKm: 20, extraHr: 200, seats: "6+1", bags: 3 },
  },
  Innova: {
    oneWay: { extraKm: 25, extraHr: 250, seats: "6+1", bags: 4 },
    rent: { extraKm: 25, extraHr: 250, seats: "6+1", bags: 4 },
    airport: { extraKm: 25, extraHr: 250, seats: "6+1", bags: 4 },
  },
};

export default function BookingClient() {
  const params = useSearchParams();

  const data = {
    car: params.get("car") || "WagonR",
    mode: params.get("mode") || "oneway",
    price: params.get("price"),
    pickup: params.get("pickup"),
    drop: params.get("drop"),
    distance: params.get("distance"),
  };

  // 🔥 current service (dynamic)
  const currentService =
    serviceData[data.car]?.[
      data.mode === "oneway" ? "oneWay" : data.mode
    ] || serviceData["WagonR"].oneWay;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4">

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4">

        {/* 🚗 CAR CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <img
            src={carImages[data.car] || "/wagonr.jpg"}
            alt={data.car}
            className="w-full h-40 md:h-48 object-cover"
          />

          <div className="p-4 space-y-3">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{data.car}</h2>

              <span className="text-pink-500 text-lg font-semibold">
                ₹{data.price}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              {data.mode} • {data.distance || 0} km
            </p>

          </div>
        </div>

        {/* 📊 SERVICE CARD (dynamic) */}
        <div className="bg-white rounded-2xl shadow p-4 text-sm space-y-1">

          <p>✔ Extra KM: ₹{currentService.extraKm}/km</p>
          <p>✔ Extra Hour: ₹{currentService.extraHr}/hr</p>
          <p>✔ Toll / Parking: Extra</p>

          <p className="text-gray-500">
            AC • {currentService.seats} • {currentService.bags} Bags
          </p>

        </div>

        {/* 📍 RIDE CARD */}
        <div className="bg-white rounded-2xl shadow p-4 text-sm space-y-2">
          <p><b>Pickup:</b> {data.pickup}</p>
          <p><b>Drop:</b> {data.drop || "N/A"}</p>
          <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
          <p><b>Time:</b> {new Date().toLocaleTimeString()}</p>
        </div>

        {/* 👤 FORM */}
        <BookingForm data={data} />

      </div>
    </div>
  );
}