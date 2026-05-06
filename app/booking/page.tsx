"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
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
    <div className="min-h-screen bg-gray-100 p-4">

      {/* 🚗 CAR INFO */}
      <div className="bg-white rounded-xl p-4 shadow mb-4">

        <img
          src="/wagonr.jpg"
          alt="car"
          className="w-full h-40 object-cover rounded-lg mb-3"
        />

        <h2 className="text-xl font-bold">{data.car}</h2>

        <p className="text-pink-500 text-lg font-semibold">
          ₹{data.price}
        </p>

        <p className="text-sm text-gray-500">
          {data.mode} • {data.distance} km
        </p>

      </div>

      {/* 📊 SERVICE DETAILS */}
      <div className="bg-white rounded-xl p-4 shadow mb-4 text-sm">

        <p>✔ Extra KM: ₹13/km</p>
        <p>✔ Extra Hour: ₹130/hr</p>
        <p>✔ Toll / Parking: Extra</p>
        <p>✔ AC • 4+1 • 2 Bags</p>

      </div>

      {/* 📍 RIDE DETAILS */}
      <div className="bg-white rounded-xl p-4 shadow mb-4 text-sm">

        <p><b>Pickup:</b> {data.pickup}</p>
        <p><b>Drop:</b> {data.drop || "N/A"}</p>

        <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
        <p><b>Time:</b> {new Date().toLocaleTimeString()}</p>

      </div>

      {/* 👤 FORM */}
      <BookingForm data={data} />

    </div>
  );
}