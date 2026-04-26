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

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 AUTO DATE + TIME (+1 HOUR)
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);

    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));

    setPickup("Mumbai, Maharashtra, India");
    setDrop("Mumbai Airport T1 / T2");
  }, []);

  // 🔥 SWITCH AUTO
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
    <section className="relative h-[85vh] md:h-screen flex items-end md:items-center">

      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${services[index].bg})` }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full px-4 md:max-w-6xl mx-auto">

        {/* 🔥 LEFT CONTENT */}
        <div className="text-white mb-4 md:mb-0">

          <h1 className="text-2xl md:text-5xl font-bold leading-tight">
            {services[index].title}
          </h1>

          {/* 🔥 CAR NAME */}
          <p className="text-sm md:text-lg text-pink-400 font-semibold mt-1">
            {services[index].car}
          </p>

          {/* 🔥 PRICE BOX */}
          <div className="mt-3 inline-block bg-white/10 backdrop-blur px-4 py-2 rounded-lg">

            <p className="text-xs text-gray-300">
              Starting From
            </p>

            <p className="text-2xl md:text-4xl font-bold text-pink-400">
              {services[index].price}
            </p>

          </div>

        </div>

        {/* 🔥 FORM */}
        <div className="bg-white rounded-xl p-4 shadow-xl w-full md:max-w-sm mt-4 md:mt-6">

          <h2 className="font-semibold text-base mb-3">
            Quick Booking
          </h2>

          {/* SWITCH */}
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

          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <input
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <button
            onClick={handleSearch}
            className="w-full bg-pink-500 text-white py-2 rounded font-semibold"
          >
            Check Fare
          </button>

        </div>

      </div>

    </section>
  );
}