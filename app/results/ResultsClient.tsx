"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResultsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const pickup = params.get("pickup") || "";
  const drop = params.get("drop") || "";
  const date = params.get("date") || "";
  const time = params.get("time") || "";

  const isAirport = drop.toLowerCase().includes("airport");

  const cars = [
    {
      name: "Innova Crysta",
      price: isAirport ? 2300 : 5500,
      extraKm: 25,
      seats: "6+1",
      img: "/crysta.jpg",
      tag: "BEST",
    },
    {
      name: "Ertiga",
      price: isAirport ? 1800 : 4200,
      extraKm: 18,
      seats: "6+1",
      img: "/ertiga.jpg",
    },
    {
      name: "Dzire",
      price: isAirport ? 1400 : 3200,
      extraKm: 15,
      seats: "4+1",
      img: "/dzire.png",
    },
  ];

  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleBooking = () => {
    if (!name || !phone || !address) {
      alert("Fill all details");
      return;
    }

    const msg = `Booking Request
Name: ${name}
Phone: ${phone}
Car: ${selectedCar.name}`;

    window.open(
      `https://wa.me/919082552031?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 pb-20">

      <button onClick={() => router.back()} className="text-pink-500 mb-4">
        ← Back
      </button>

      <div className="bg-white p-4 rounded mb-4">
        <p><b>Pickup:</b> {pickup}</p>
        <p><b>Drop:</b> {drop}</p>
        <p><b>Date:</b> {date}</p>
        <p><b>Time:</b> {time}</p>
      </div>

      {cars.map((car, i) => (
        <div key={i} className="bg-white p-4 rounded mb-4 shadow">

          <div className="flex gap-3 items-center">
            <img src={car.img} className="w-24 h-16 rounded" />

            <div className="flex-1">
              <h3 className="font-bold">{car.name}</h3>
              <p className="text-xs">150 KM Included</p>
            </div>

            <div className="text-pink-500 font-bold">
              ₹ {car.price}
            </div>
          </div>

          <button
            onClick={() => setSelectedCar(car)}
            className="w-full mt-2 bg-pink-500 text-white py-2 rounded"
          >
            Book Now
          </button>

        </div>
      ))}

      {selectedCar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-white p-4 rounded w-full max-w-sm">

            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 p-2 border"
            />

            <input
              placeholder="Phone"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-2 p-2 border"
            />

            <textarea
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mb-2 p-2 border"
            />

            <button
              onClick={handleBooking}
              className="w-full bg-pink-500 text-white py-2"
            >
              Confirm
            </button>

          </div>

        </div>
      )}

    </main>
  );
}