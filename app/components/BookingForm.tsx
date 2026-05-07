"use client";

import emailjs from "@emailjs/browser";

import {
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
  BadgeIndianRupee,
} from "lucide-react";

import { useState } from "react";

export default function BookingForm({
  data,
}: any) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",

      phone: "",

      email: "",

      address: "",

      payment: "Cash",
    });

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
  // PHONE VALIDATION
  // =========================
  const isValidPhone = (
    phone: string
  ) => {

    return /^[6-9]\d{9}$/.test(
      phone
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

      // =====================
      // SEND EMAIL
      // =====================
      await emailjs.send(

        // EMAILJS SERVICE ID
        "YOUR_SERVICE_ID",

        // EMAILJS TEMPLATE ID
        "YOUR_TEMPLATE_ID",

        {

          // ===================
          // BOOKING DETAILS
          // ===================
          car: data.car,

          mode: data.mode,

          price: data.price,

          pickup:
            data.pickup,

          drop:
            data.drop,

          distance:
            data.distance,

          duration:
            data.duration,

          bookingDate:
            data.bookingDate,

          bookingTime:
            data.bookingTime,

          // ===================
          // USER DETAILS
          // ===================
          name:
            form.name,

          phone:
            `+91 ${form.phone}`,

          email:
            form.email,

          address:
            form.address,

          payment:
            form.payment,

          // ===================
          // RECEIVER
          // ===================
          to_email:
            "webappseostudio@gmail.com",
        },

        // EMAILJS PUBLIC KEY
        "YOUR_PUBLIC_KEY"
      );

      // SUCCESS
      alert(
        "🎉 Booking Confirmed Successfully 🚖"
      );

      // RESET
      setForm({

        name: "",

        phone: "",

        email: "",

        address: "",

        payment: "Cash",
      });

      // THANK YOU PAGE
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

    <div
      className="
        bg-white
        rounded-[28px]
        p-5
        shadow-xl
      "
    >

      {/* HEADER */}
      <div className="mb-5">

        <h3
          className="
            text-2xl
            font-black
          "
        >
          Complete Booking
        </h3>

        <p className="text-gray-500">
          Safe & secure cab booking
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* NAME */}
        <div
          className="
            flex
            items-center
            gap-3
            h-12
            px-4
            rounded-2xl
            bg-gray-100
          "
        >

          <User
            size={18}
            className="text-pink-500"
          />

          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            className="
              bg-transparent
              w-full
              outline-none
              text-sm
            "
          />
        </div>

        {/* PHONE */}
        <div
          className="
            flex
            items-center
            gap-3
            h-12
            px-4
            rounded-2xl
            bg-gray-100
          "
        >

          <Phone
            size={18}
            className="text-pink-500"
          />

          <span
            className="
              text-sm
              font-semibold
            "
          >
            +91
          </span>

          <input
            type="tel"
            required
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="9999999999"
            value={form.phone}
            onChange={(e) => {

              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              if (
                value.length <= 10
              ) {

                setForm({
                  ...form,
                  phone: value,
                });
              }
            }}
            className="
              bg-transparent
              w-full
              outline-none
              text-sm
            "
          />
        </div>

        {/* EMAIL */}
        <div
          className="
            flex
            items-center
            gap-3
            h-12
            px-4
            rounded-2xl
            bg-gray-100
          "
        >

          <Mail
            size={18}
            className="text-pink-500"
          />

          <input
            type="email"
            required

            // AUTO GMAIL SUGGEST
            autoComplete="email"

            spellCheck={false}

            placeholder="yourgmail@gmail.com"

            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }

            className="
              bg-transparent
              w-full
              outline-none
              text-sm
            "
          />
        </div>

        {/* ADDRESS */}
        <div
          className="
            flex
            items-center
            gap-3
            h-12
            px-4
            rounded-2xl
            bg-gray-100
          "
        >

          <MapPin
            size={18}
            className="text-pink-500"
          />

          <input
            type="text"

            autoComplete="street-address"

            placeholder="Address / Landmark"

            value={form.address}

            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }

            className="
              bg-transparent
              w-full
              outline-none
              text-sm
            "
          />
        </div>

        {/* PAYMENT */}
        <div
          className="
            border-2
            border-pink-500
            bg-pink-50
            rounded-2xl
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <BadgeIndianRupee
              size={20}
              className="text-pink-500"
            />

            <div>

              <h4 className="font-bold">
                Cash Payment
              </h4>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Pay directly to driver
                after ride completion
              </p>

            </div>

            <input
              type="radio"
              checked
              readOnly
              className="ml-auto"
            />

          </div>

        </div>

        {/* RIDE INFO */}
        <div
          className="
            bg-gray-100
            rounded-2xl
            p-4
            text-sm
            space-y-2
          "
        >

          <p>
            <b>Date:</b>{" "}
            {data.bookingDate}
          </p>

          <p>
            <b>Time:</b>{" "}
            {data.bookingTime}
          </p>

          <p>
            <b>Distance:</b>{" "}
            {data.distance} km
          </p>

          <p>
            <b>Duration:</b>{" "}
            {data.duration}
          </p>

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-12
            rounded-2xl
            font-bold
            text-white
            bg-gradient-to-r
            from-pink-500
            to-rose-500
            hover:scale-[1.01]
            transition-all
            duration-300
            disabled:opacity-60
            flex
            items-center
            justify-center
            gap-2
          "
        >

          {loading ? (

            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Sending...
            </>

          ) : (

            <>
              Confirm Booking 🚖
            </>
          )}

        </button>

      </form>
    </div>
  );
}