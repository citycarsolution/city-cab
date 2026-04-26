"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const services = [
    {
      title: "Mumbai to Pune OneWay Cab",
      car: "Innova Crysta",
      price: "₹5500",
      bg: "/pune.png",
      type: "oneway",
    },
    {
      title: "Mumbai Airport Drop",
      car: "Innova Crysta",
      price: "₹2300",
      bg: "/airport.png",
      type: "airport",
    },
  ];

  const [index, setIndex] = useState(0);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // AUTO DATE + TIME
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);

    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));

    setPickup("Mumbai, Maharashtra, India");
    setDrop("Mumbai Airport T1 / T2");
  }, []);

  // SWITCH DROP
  useEffect(() => {
    if (services[index].type === "airport") {
      setDrop("Mumbai Airport T1 / T2");
    } else {
      setDrop("Pune, Maharashtra, India");
    }
  }, [index]);

  const handleSearch = () => {
    router.push(
      `/results?pickup=${pickup}&drop=${drop}&date=${date}&time=${time}`
    );
  };

  return (
    <section className="relative isolate h-[85vh] md:h-screen flex items-end md:items-center overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${services[index].bg})` }}
      />

      {/* DARK OVERLAY (SAFE) */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10 w-full px-4 md:max-w-6xl mx-auto">

        {/* TEXT */}
        <div className="text-white mb-4">

          <h1 className="text-2xl md:text-5xl font-bold leading-tight">
            {services[index].title}
          </h1>

          <p className="text-sm md:text-lg text-pink-400 font-semibold mt-1">
            {services[index].car}
          </p>

          {/* PRICE FIX (NO BLUR) */}
          <div className="mt-3 inline-block bg-black/40 px-4 py-2 rounded-lg">

            <p className="text-xs text-gray-300">
              Starting From
            </p>

            <p className="text-2xl md:text-4xl font-bold text-pink-400">
              {services[index].price}
            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl p-4 shadow-xl w-full md:max-w-sm mt-4 md:mt-6">

          <h2 className="font-semibold text-base mb-3">
            Quick Booking
          </h2>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setIndex(1)}
              className={`flex-1 py-2 rounded ${
                services[index].type === "airport"
                  ? "bg-pink-500 text-white"
                  : "border text-pink-500"
              }`}
            >
              Airport
            </button>

            <button
              onClick={() => setIndex(0)}
              className={`flex-1 py-2 rounded ${
                services[index].type === "oneway"
                  ? "bg-pink-500 text-white"
                  : "border text-pink-500"
              }`}
            >
              Oneway
            </button>
          </div>

          <input value={pickup} className="input" />
          <input value={drop} className="input" />
          <input type="date" value={date} className="input" />
          <input type="time" value={time} className="input" />

          <button
            onClick={handleSearch}
            className="w-full bg-pink-500 text-white py-3 rounded-lg mt-2"
          >
            Check Fare
          </button>

        </div>

      </div>

    </section>
  );
}