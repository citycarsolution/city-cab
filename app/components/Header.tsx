"use client";

import {
  Phone,
  Home,
  ShieldCheck,
  FileText,
  BadgeIndianRupee,
} from "lucide-react";

export default function Header() {

  return (

    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        bg-white/95
        backdrop-blur-xl
        border-b
        border-pink-100
        shadow-sm
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          h-16
          px-4
          flex
          items-center
          justify-between
        "
      >

        {/* LOGO */}
        <a
          href="/"
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-2xl
              bg-gradient-to-br
              from-pink-500
              to-rose-500
              flex
              items-center
              justify-center
              text-white
              font-black
              text-lg
            "
          >
            C
          </div>

          <div>

            <h1
              className="
                text-xl
                font-black
                bg-gradient-to-r
                from-pink-500
                to-rose-500
                bg-clip-text
                text-transparent
              "
            >
              CityCabSolution
            </h1>

            <p
              className="
                text-[11px]
                text-gray-400
              "
            >
              Premium Cab Booking
            </p>

          </div>

        </a>

        {/* MENU */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-6
          "
        >

          <a
            href="/"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              hover:text-pink-500
            "
          >
            <Home size={16} />
            Home
          </a>

          <a
            href="/privacy"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              hover:text-pink-500
            "
          >
            <ShieldCheck size={16} />
            Privacy
          </a>

          <a
            href="/terms"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              hover:text-pink-500
            "
          >
            <FileText size={16} />
            Terms
          </a>

          <a
            href="/refund"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              hover:text-pink-500
            "
          >
            <BadgeIndianRupee size={16} />
            Refund
          </a>

        </div>

        {/* CALL BUTTON */}
        <a
          href="tel:9082552031"
          className="
            bg-gradient-to-r
            from-pink-500
            to-rose-500
            text-white
            px-5
            py-2.5
            rounded-2xl
            font-bold
            text-sm
            hover:scale-105
            transition-all
            duration-300
            flex
            items-center
            gap-2
          "
        >

          <Phone size={16} />

          Call Now

        </a>

      </div>

    </header>
  );
}