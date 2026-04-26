export default function About() {
  return (
    <section className="py-16 bg-white px-4">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About City Cab Solution
          </h2>

          <p className="text-gray-600 mb-4">
            We provide trusted and affordable cab services across 
            Mumbai and Pune. Whether you need an airport drop or 
            a comfortable intercity ride, we ensure smooth and 
            hassle-free travel.
          </p>

          <p className="text-gray-600 mb-6">
            Our drivers are verified, cars are clean, and service 
            is available 24x7. Thousands of customers trust us 
            daily for safe and on-time travel.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-3 text-sm">

            <div className="bg-gray-100 p-3 rounded">
              ✔ Clean Cars
            </div>

            <div className="bg-gray-100 p-3 rounded">
              ✔ Verified Drivers
            </div>

            <div className="bg-gray-100 p-3 rounded">
              ✔ 24x7 Service
            </div>

            <div className="bg-gray-100 p-3 rounded">
              ✔ On-Time Pickup
            </div>

          </div>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div>
          <img
            src="/crysta.jpg"
            className="rounded-xl shadow-lg w-full"
          />
        </div>

      </div>

    </section>
  );
}