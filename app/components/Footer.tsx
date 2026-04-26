"use client";

export default function Footer() {
  return (
    <>
      {/* NORMAL FOOTER */}
      <footer className="bg-black text-white text-center py-6">
        <p>© 2026 City Cab Solution</p>
        <p className="text-sm mt-1">Mumbai • Pune</p>
      </footer>

      {/* 🔥 MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center py-2 z-50 md:hidden">

        {/* HOME */}
        <a href="/" className="flex flex-col items-center text-xs">
          🏠
          <span>Home</span>
        </a>

        {/* CALL */}
        <a
          href="tel:9082552031"
          className="flex flex-col items-center text-xs text-pink-500 font-semibold"
        >
          📞
          <span>Call</span>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/919082552031"
          target="_blank"
          className="flex flex-col items-center text-xs text-green-600 font-semibold"
        >
          💬
          <span>WhatsApp</span>
        </a>

      </div>
    </>
  );
}