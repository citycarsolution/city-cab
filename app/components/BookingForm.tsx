"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";

export default function BookingForm({ data }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          car: data.car,
          mode: data.mode,
          price: data.price,
          pickup: data.pickup,
          drop: data.drop,
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
        },
        "YOUR_PUBLIC_KEY"
      );

      alert("Booking Sent 🚖");

      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });

    } catch (err) {
      alert("Error sending booking ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border">

      {/* HEADER */}
      <h3 className="text-lg font-semibold mb-3">
        Enter Details
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* NAME */}
        <input
          placeholder="Full Name"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          placeholder="Mobile Number"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          placeholder="Email (optional)"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* ADDRESS */}
        <input
          placeholder="Address / Landmark"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-200 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Confirm Booking 🚖"}
        </button>

      </form>
    </div>
  );
}