"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "../components/BookingForm";

export default function BookingClient() {
  const params = useSearchParams();

  const data = {
    car: params.get("car"),
    mode: params.get("mode"),
    price: params.get("price"),
    pickup: params.get("pickup"),
    drop: params.get("drop"),
    distance: params.get("distance"),
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4">

        {/* 🚗 CAR CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <img
            src="/wagonr.jpg"
            alt="car"
            className="w-full h-40 md:h-48 object-cover"
          />

          <div className="p-4 space-y-3">

            <div>
              <h2 className="text-xl font-bold">{data.car}</h2>

              <p className="text-pink-500 text-lg font-semibold">
                ₹{data.price}
              </p>

              <p className="text-xs text-gray-500">
                {data.mode} • {data.distance || 0} km
              </p>
            </div>

          </div>
        </div>

        {/* 📊 SERVICE CARD */}
        <div className="bg-white rounded-2xl shadow p-4 text-sm space-y-1">
          <p>✔ Extra KM: ₹13/km</p>
          <p>✔ Extra Hour: ₹130/hr</p>
          <p>✔ Toll / Parking: Extra</p>
          <p>✔ AC • 4+1 • 2 Bags</p>
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