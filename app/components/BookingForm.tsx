"use client";

import emailjs from "emailjs-com";
import { useState } from "react";

export default function BookingForm({ data }: any) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    emailjs.send(
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
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">

      <h3 className="font-bold mb-3">Enter Details</h3>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          placeholder="Name"
          className="input"
          required
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Mobile"
          className="input"
          required
          onChange={(e)=>setForm({...form,phone:e.target.value})}
        />

        <input
          placeholder="Email"
          className="input"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          placeholder="Address / Landmark"
          className="input"
          onChange={(e)=>setForm({...form,address:e.target.value})}
        />

        <button className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold">
          Confirm Booking
        </button>

      </form>

    </div>
  );
}