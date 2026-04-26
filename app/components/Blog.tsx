"use client";

export default function Blog() {
  const posts = [
    {
      title: "Mumbai to Pune Cab Guide",
      desc: "Best tips to book affordable cab from Mumbai to Pune.",
    },
    {
      title: "Airport Drop Tips",
      desc: "How to reach Mumbai Airport on time without stress.",
    },
    {
      title: "Save Money on Cab Booking",
      desc: "Simple tricks to get best price on cab service.",
    },
  ];

  return (
    <section className="py-16 bg-gray-100 px-4 text-center">

      <h2 className="text-3xl font-bold mb-10">
        Latest Updates
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {posts.map((post, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow 
                       transform transition duration-300 
                       hover:-translate-y-2 hover:shadow-xl"
          >

            <h3 className="font-semibold text-lg mb-2">
              {post.title}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {post.desc}
            </p>

            <button className="text-pink-500 font-semibold text-sm">
              Read More →
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}