"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {

  const router = useRouter();

  // AUTO REDIRECT AFTER 7 SECONDS
  useEffect(() => {

    const timer = setTimeout(() => {

      router.push("/");

    }, 7000);

    return () => clearTimeout(timer);

  }, [router]);

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-pink-500
        to-rose-500
        text-white
        p-4
      "
    >

      <div
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-[32px]
          p-10
          text-center
          max-w-md
          w-full
          shadow-2xl
        "
      >

        <div className="text-6xl mb-5 animate-bounce">
          🚖
        </div>

        <h1
          className="
            text-4xl
            font-black
            mb-3
          "
        >
          Thank You
        </h1>

        <p
          className="
            text-white/80
            text-lg
          "
        >
          Your cab booking has been
          received successfully.
        </p>

        <p
          className="
            text-white/70
            text-sm
            mt-4
          "
        >
          Driver will contact you soon.
        </p>

        <div
          className="
            mt-6
            text-sm
            text-white/70
          "
        >
          Redirecting to home page in 7 seconds...
        </div>

      </div>
    </div>
  );
}