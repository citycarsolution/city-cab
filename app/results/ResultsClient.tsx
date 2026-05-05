"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

type CarName = "WagonR" | "Dzire" | "Ertiga" | "Innova Crysta";
type PackageType = "8hr/80km" | "12hr/120km";

export default function ResultsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const pickup = params.get("pickup") || "";
  const drop = params.get("drop") || "";
  const mode = (params.get("mode") || "oneway") as
    | "oneway"
    | "airport"
    | "rent";
  const pkg = (params.get("pkg") || "8hr/80km") as PackageType;

  const isAirport = mode === "airport";
  const isRent = mode === "rent";

  // 🔥 PRICING SYSTEM (FINAL)
  const pricing = {
    oneway: {
      baseKm: 100,
      cars: {
        WagonR: { price: 1800, extraKm: 13 },
        Dzire: { price: 2000, extraKm: 15 },
        Ertiga: { price: 2750, extraKm: 20 },
        "Innova Crysta": { price: 4250, extraKm: 25 },
      } as Record<CarName, { price: number; extraKm: number }>,
    },

    airport: {
      cars: {
        WagonR: { price: 650, extraKm: 13 },
        Dzire: { price: 750, extraKm: 15 },
        Ertiga: { price: 950, extraKm: 20 },
        "Innova Crysta": { price: 2300, extraKm: 25 },
      } as Record<CarName, { price: number; extraKm: number }>,
    },

    rent: {
      packages: {
        "8hr/80km": {
          WagonR: 2000,
          Dzire: 2300,
          Ertiga: 3000,
          "Innova Crysta": 4000,
        },
        "12hr/120km": {
          WagonR: 2500,
          Dzire: 2900,
          Ertiga: 3600,
          "Innova Crysta": 4900,
        },
      } as Record<PackageType, Record<CarName, number>>,
    },
  };

  const cars: { name: CarName; seats: string; type: string; luggage: string; img: string }[] = [
    { name: "WagonR", seats: "4+1", type: "CNG", luggage: "2 Bag", img: "/wagonr.jpg" },
    { name: "Dzire", seats: "4+1", type: "Diesel", luggage: "2 Bag", img: "/dzire.png" },
    { name: "Ertiga", seats: "6+1", type: "CNG/Diesel", luggage: "3 Bag", img: "/ertiga.jpg" },
    { name: "Innova Crysta", seats: "6+1", type: "Diesel", luggage: "3 Bag", img: "/crysta.jpg" },
  ];

  // 💰 PRICE FUNCTION (FIXED)
  const getPrice = (carName: CarName) => {
    if (isRent) {
      return pricing.rent.packages[pkg][carName];
    }
    if (isAirport) {
      return pricing.airport.cars[carName].price;
    }
    return pricing.oneway.cars[carName].price;
  };

  const getExtraKm = (carName: CarName) => {
    if (isAirport) return pricing.airport.cars[carName].extraKm;
    return pricing.oneway.cars[carName].extraKm;
  };

  const [selectedCar, setSelectedCar] = useState<CarName | null>(null);

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <button onClick={() => router.back()} className="text-pink-500 mb-4 font-semibold">
        ← Back
      </button>

      {/* TRIP INFO */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <p className="font-semibold">{pickup}</p>
        <p>→ {drop}</p>
        <p className="text-sm text-gray-500 mt-1">
          {isRent && pkg}
          {isAirport && "Airport Transfer"}
          {!isRent && !isAirport && "0–100 KM Package"}
        </p>
      </div>

      {/* CAR LIST */}
      {cars.map((car) => (
        <div key={car.name} className="bg-white rounded-xl shadow mb-4 p-4">

          <div className="flex gap-3">
            <img src={car.img} className="w-28 h-20 rounded-lg object-cover" />

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{car.name}</h3>
                <span className="text-pink-500 text-xl font-bold">
                  ₹{getPrice(car.name)}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {car.seats} • AC • {car.type}
              </p>

              <p className="text-xs text-gray-500">
                🧳 {car.luggage}
              </p>

              <div className="text-xs mt-2 space-y-1">
                {!isRent && (
                  <>
                    <p>✔ Base Included</p>
                    <p className="text-red-500">✘ Extra ₹{getExtraKm(car.name)}/km</p>
                    <p className="text-red-500">✘ Toll / Parking Extra</p>
                    <p>✔ Driver Allowance Included</p>
                  </>
                )}

                {isRent && (
                  <>
                    <p>✔ {pkg} Included</p>
                    <p className="text-red-500">✘ Extra ₹{getExtraKm(car.name)}/km</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedCar(car.name)}
            className="w-full mt-4 bg-pink-500 text-white py-3 rounded-lg"
          >
            Book Now
          </button>
        </div>
      ))}

    </main>
  );
}