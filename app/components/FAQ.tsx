"use client";

import { useState } from "react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is toll & parking included?",
      a: "No, toll & parking charges are extra and paid by the customer.",
    },
    {
      q: "Is driver allowance included?",
      a: "Yes, driver allowance is included in the fare.",
    },
    {
      q: "What is included in one-way fare?",
      a: "Fare includes car, fuel, and driver charges. Extra km will be charged additionally.",
    },
    {
      q: "How can I book a cab?",
      a: "You can book via WhatsApp or call directly for instant confirmation.",
    },
    {
      q: "Is service available at night?",
      a: "Yes, 24x7 service available. Night charges may apply.",
    },
  ];

  return (
    <section className="py-16 bg-white px-4">

      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="max-w-2xl mx-auto space-y-3">

        {faqs.map((item, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">

            {/* QUESTION */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center p-4 font-semibold text-left"
            >
              {item.q}
              <span className="text-pink-500">
                {open === i ? "-" : "+"}
              </span>
            </button>

            {/* ANSWER */}
            {open === i && (
              <div className="p-4 pt-0 text-sm text-gray-600">
                {item.a}
              </div>
            )}

          </div>
        ))}

      </div>

    </section>
  );
}