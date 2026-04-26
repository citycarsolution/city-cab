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
Pickup: ${pickup}
Drop: ${drop}
Car: ${selectedCar.name}
Price: ₹${selectedCar.price}`;

    window.open(
      `https://wa.me/919082552031?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 pb-24">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="text-pink-500 mb-4 font-semibold"
      >
        ← Back
      </button>

      {/* TRIP INFO */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 text-sm">
        <p><b>Pickup:</b> {pickup}</p>
        <p><b>Drop:</b> {drop}</p>
        <p><b>Date:</b> {date}</p>
        <p><b>Time:</b> {time}</p>
      </div>

      {/* CAR LIST */}
      {cars.map((car, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow mb-4">

          <div className="flex gap-3">

            <img
              src={car.img}
              className="w-24 h-16 object-cover rounded-lg"
            />

            <div className="flex-1">

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{car.name}</h3>

                <span className="text-pink-500 font-bold text-lg">
                  ₹ {car.price}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-1">
                {car.seats} Seats • AC
              </p>

              {/* CONDITIONS */}
              <div className="text-xs space-y-1 mt-2">

                {isAirport ? (
                  <>
                    <p>✔ 4 Hours / 40 KM Included</p>
                    <p>✔ Driver Allowance Included</p>
                    <p>✔ AC Car</p>
                    <p className="text-red-500">✘ Toll & Parking Extra</p>
                    <p className="text-red-500">✘ Extra ₹{car.extraKm}/km after limit</p>
                  </>
                ) : (
                  <>
                    <p>✔ 150 KM Included</p>
                    <p>✔ Driver Allowance Included</p>
                    <p>✔ AC Car</p>
                    <p className="text-red-500">✘ Toll & Parking Extra</p>
                    <p className="text-red-500">✘ Extra ₹{car.extraKm}/km after limit</p>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => setSelectedCar(car)}
            className="w-full mt-4 bg-pink-500 text-white py-3 rounded-lg font-semibold"
          >
            Book Now
          </button>

        </div>
      ))}

      {/* BOOKING MODAL */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">

          <div className="bg-white w-full md:max-w-sm p-5 rounded-t-xl md:rounded-xl">

            <h3 className="font-bold text-lg mb-3">
              Book {selectedCar.name}
            </h3>

            <input
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 p-3 border rounded-lg"
            />

            <input
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-2 p-3 border rounded-lg"
            />

            <textarea
              placeholder="Pickup Address"
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg"
            />

            <button
              onClick={handleBooking}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold"
            >
              Confirm Booking
            </button>

            <button
              onClick={() => setSelectedCar(null)}
              className="w-full mt-2 text-gray-500"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </main>
  );
}