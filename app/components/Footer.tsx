"use client";
import {
  Home,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  BadgeIndianRupee,
  MessageCircle,
} from "lucide-react";

export default function Footer() {

  return (

    <>
      {/* ========================= */}
      {/* PREMIUM FOOTER */}
      {/* ========================= */}

      <footer
        className="
          bg-black
          text-white
          pt-14
          pb-24
          mt-16
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            grid
            md:grid-cols-3
            gap-10
          "
        >

          {/* BRAND */}
          <div>

            <div
              className="
                flex
                items-center
                gap-3
                mb-5
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-pink-500
                  to-rose-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-xl
                  font-black
                "
              >
                C
              </div>

              <div>

                <h2
                  className="
                    text-2xl
                    font-black
                  "
                >
                  City Cab Solution
                </h2>

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Premium Cab Booking
                </p>

              </div>

            </div>

            <p
              className="
                text-gray-400
                leading-7
                text-sm
              "
            >
              Reliable local & outstation cab
              service with professional drivers,
              clean A.C. cars and affordable fares.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h3
              className="
                text-xl
                font-bold
                mb-5
              "
            >
              Quick Links
            </h3>

            <div className="space-y-4">

              <a
                href="/"
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-300
                  hover:text-pink-400
                  transition
                "
              >
                <Home size={18} />
                Home
              </a>

              <a
                href="/privacy"
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-300
                  hover:text-pink-400
                  transition
                "
              >
                <ShieldCheck size={18} />
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-300
                  hover:text-pink-400
                  transition
                "
              >
                <FileText size={18} />
                Terms & Conditions
              </a>

              <a
                href="/refund"
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-300
                  hover:text-pink-400
                  transition
                "
              >
                <BadgeIndianRupee size={18} />
                Refund Policy
              </a>

            </div>

          </div>

          {/* CONTACT */}
          <div>

            <h3
              className="
                text-xl
                font-bold
                mb-5
              "
            >
              Contact Us
            </h3>

            <div className="space-y-5">

              <a
                href="tel:9082552031"
                className="
                  flex
                  items-start
                  gap-3
                  text-gray-300
                  hover:text-pink-400
                  transition
                "
              >

                <Phone
                  size={18}
                  className="mt-1"
                />

                <div>

                  <p className="font-semibold">
                    Call Now
                  </p>

                  <p className="text-sm">
                    +91 9082552031
                  </p>

                </div>

              </a>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  text-gray-300
                "
              >

                <MapPin
                  size={18}
                  className="mt-1"
                />

                <p className="text-sm leading-6">

                  Address:
                  <br />

                  Indra Kripa Building,
                  Government Colony,
                  Bandra East,
                  Mumbai,
                  Maharashtra 400051

                </p>

              </div>

              <a
                href="https://citycabsolution.in/"
                target="_blank"
                className="
                  inline-block
                  mt-2
                  text-pink-400
                  font-semibold
                  hover:text-pink-300
                "
              >
                citycabsolution.in
              </a>

            </div>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div
          className="
            border-t
            border-white/10
            mt-10
            pt-6
            text-center
            text-sm
            text-gray-400
          "
        >

          © 2026 City Cab Solution.
          All rights reserved.

        </div>

      </footer>

     {/* ========================= */}
{/* MOBILE STICKY BAR */}
{/* ========================= */}

<div
  className="
    fixed
    bottom-0
    left-0
    w-full
    bg-white/95
    backdrop-blur-xl
    border-t
    border-pink-100
    flex
    justify-around
    items-center
    py-3
    z-50
    md:hidden
    shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
  "
>

  {/* HOME */}
  <a
    href="/"
    className="
      flex
      flex-col
      items-center
      text-[11px]
      font-semibold
      text-gray-700
    "
  >

    <Home
      size={20}
      className="mb-1"
    />

    Home

  </a>

  {/* CALL */}
  <a
    href="tel:9082552031"
    className="
      flex
      flex-col
      items-center
      text-[11px]
      font-bold
      text-pink-500
    "
  >

    <Phone
      size={20}
      className="mb-1"
    />

    Call

  </a>

  {/* WHATSAPP */}
  <a
    href="https://wa.me/919082552031"
    target="_blank"
    className="
      flex
      flex-col
      items-center
      text-[11px]
      font-bold
      text-green-600
    "
  >

    <MessageCircle
      size={20}
      className="mb-1"
    />

    WhatsApp

  </a>

</div>
    </>
  );
}