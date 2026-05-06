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
        "YOUR_SERVICE_ID", // 👉 replace
        "YOUR_TEMPLATE_ID", // 👉 replace
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
        "YOUR_PUBLIC_KEY" // 👉 replace
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
    <div className="bg-white rounded-xl p-4 shadow">

      <h3 className="font-bold mb-3">Enter Details</h3>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          placeholder="Name"
          className="input"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Mobile"
          className="input"
          required
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Address / Landmark"
          className="input"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Sending..." : "Confirm Booking"}
        </button>

      </form>

    </div>
  );
}