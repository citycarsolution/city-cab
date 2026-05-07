"use client";

import emailjs from "@emailjs/browser";
import { useState, useEffect } from "react";

export default function BookingForm({ data }: any) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "Cash",
  });

  // =========================
  // AUTO EMAIL DETECT
  // =========================
  useEffect(() => {

    const savedEmail =
      localStorage.getItem("user_email");

    if (savedEmail) {

      setForm((prev) => ({
        ...prev,
        email: savedEmail,
      }));
    }

  }, []);

  // =========================
  // PHONE VALIDATION
  // =========================
  const isValidPhone = (
    phone: string
  ) => {

    return /^[6-9]\d{9}$/.test(phone);
  };

  // =========================
  // EMAIL VALIDATION
  // =========================
  const isValidEmail = (
    email: string
  ) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    e: any
  ) => {

    e.preventDefault();

    // PHONE CHECK
    if (
      !isValidPhone(
        form.phone
      )
    ) {

      alert(
        "Enter valid 10 digit mobile number"
      );

      return;
    }

    // EMAIL CHECK
    if (
      form.email &&
      !isValidEmail(
        form.email
      )
    ) {

      alert(
        "Enter valid email address"
      );

      return;
    }

    try {

      setLoading(true);

      // SAVE EMAIL
      localStorage.setItem(
        "user_email",
        form.email
      );

      // =========================
      // SEND EMAIL
      // =========================
      await emailjs.send(

        // SERVICE ID
        "service_nyf10gh",

        // TEMPLATE ID
        "template_58tjlqp",

        {

          // =====================
          // BOOKING DETAILS
          // =====================
          car: data.car,

          mode: data.mode,

          price: data.price,

          pickup: data.pickup,

          drop: data.drop,

          distance:
            data.distance,

          duration:
            data.duration,

          bookingDate:
            data.bookingDate,

          bookingTime:
            data.bookingTime,

          // =====================
          // USER DETAILS
          // =====================
          name: form.name,

          phone:
            `+91 ${form.phone}`,

          email:
            form.email,

          address:
            form.address,

          payment:
            form.payment,

          // =====================
          // RECEIVER EMAIL
          // =====================
          to_email:
            "webappseostudio@gmail.com",
        },

        // PUBLIC KEY
        "hT2h0GCkb0gmhnT2_"
      );

      // SUCCESS
      alert(
        "🎉 Booking Confirmed Successfully 🚖"
      );

      // RESET
      setForm({

        name: "",

        phone: "",

        email: form.email,

        address: "",

        payment: "Cash",
      });

      // REDIRECT
      setTimeout(() => {

        window.location.href =
          "/thank-you";

      }, 3000);

    } catch (err) {

      console.log(err);

      alert(
        "Booking Failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-5">

      {/* HEADER */}
      <div className="mb-5">

        <h2 className="text-3xl font-bold text-black">
          Complete Booking
        </h2>

        <p className="text-gray-500 mt-1">
          Safe & secure cab booking
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* NAME */}
        <div className="bg-gray-100 rounded-2xl px-4 py-4">

          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            className="w-full bg-transparent outline-none text-lg"
          />

        </div>

        {/* PHONE */}
        <div className="bg-gray-100 rounded-2xl px-4 py-4 flex items-center gap-3">

          <span className="font-semibold text-black">
            +91
          </span>

          <input
            type="tel"
            placeholder="9999999999"
            required
            maxLength={10}
            value={form.phone}
            onChange={(e) => {

              const onlyNums =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              setForm({
                ...form,
                phone:
                  onlyNums,
              });
            }}
            className="w-full bg-transparent outline-none text-lg"
          />

        </div>

        {/* EMAIL */}
        <div className="bg-gray-100 rounded-2xl px-4 py-4">

          <input
            type="email"
            placeholder="Enter Gmail"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
            className="w-full bg-transparent outline-none text-lg"
          />

        </div>

        {/* ADDRESS */}
        <div className="bg-gray-100 rounded-2xl px-4 py-4">

          <input
            type="text"
            placeholder="Address / Landmark"
            required
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
            className="w-full bg-transparent outline-none text-lg"
          />

        </div>

        {/* PAYMENT */}
        <div className="border-2 border-pink-500 rounded-2xl p-4 flex justify-between items-center">

          <div>

            <h3 className="font-bold text-xl">
              Cash Payment
            </h3>

            <p className="text-gray-500 text-sm">
              Pay directly to driver after ride
            </p>

          </div>

          <input
            type="radio"
            checked
            readOnly
            className="w-5 h-5 accent-pink-500"
          />

        </div>

        {/* BOOKING INFO */}
        <div className="bg-gray-100 rounded-2xl p-4 text-sm space-y-2">

          <p>
            <b>Date:</b>{" "}
            {data.bookingDate || "N/A"}
          </p>

          <p>
            <b>Time:</b>{" "}
            {data.bookingTime || "N/A"}
          </p>

          <p>
            <b>Distance:</b>{" "}
            {data.distance || 0} km
          </p>

          <p>
            <b>Duration:</b>{" "}
            {data.duration || "N/A"}
          </p>

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
        >

          {
            loading
              ? "Sending..."
              : "Confirm Booking 🚖"
          }

        </button>

      </form>

    </div>
  );
}