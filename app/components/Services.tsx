export default function Services() {
  return (
    <section className="py-16 bg-gray-100 px-4 text-center">

      <h2 className="text-3xl font-bold mb-2">
        Our Services
      </h2>

      <p className="text-gray-500 mb-10">
        Fast, reliable & affordable cab service in Mumbai & Pune
      </p>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {/* AIRPORT */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

          <div className="text-4xl mb-3">✈️</div>

          <h3 className="font-semibold text-lg mb-2">
            Airport Drop
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Mumbai Airport pickup & drop with on-time service and clean cars.
          </p>

          <a
            href="https://wa.me/919082552031?text=Airport Drop Booking"
            className="text-pink-500 font-semibold text-sm"
          >
            Book Now →
          </a>

        </div>

        {/* PUNE */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

          <div className="text-4xl mb-3">🚗</div>

          <h3 className="font-semibold text-lg mb-2">
            Mumbai to Pune
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Comfortable one-way cab service from Mumbai to Pune at best price.
          </p>

          <a
            href="https://wa.me/919082552031?text=Mumbai to Pune Booking"
            className="text-pink-500 font-semibold text-sm"
          >
            Book Now →
          </a>

        </div>

        {/* 24/7 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

          <div className="text-4xl mb-3">🕐</div>

          <h3 className="font-semibold text-lg mb-2">
            24x7 Service
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Available anytime with instant booking and quick response support.
          </p>

          <a
            href="tel:9082552031"
            className="text-pink-500 font-semibold text-sm"
          >
            Call Now →
          </a>

        </div>

      </div>

    </section>
  );
}