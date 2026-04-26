"use client";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-14">

        <h1 className="font-bold text-lg text-pink-500">
          CityCab
        </h1>

        <div className="flex gap-3">
          <a href="tel:9082552031" className="text-sm">Call</a>
          <a href="https://wa.me/919082552031" className="bg-pink-500 text-white px-3 py-1 rounded text-sm">
            WhatsApp
          </a>
        </div>

      </div>
    </header>
  );
}