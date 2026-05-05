import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const Home = () => {
  const renderStars = (rating) => {
    const maxStars = 5;

    return (
      <div className="flex gap-1 mb-2">
        {[...Array(maxStars)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} className="text-yellow-400" />
          ) : (
            <FaRegStar key={index} className="text-gray-300" />
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-white">

      {/* WHY CHOOSE SONIQ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          Why Choose SONIQ?
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Premium features designed for the ultimate listening experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Noise Cancellation",
              desc: "Advanced ANC technology blocks out distractions for pure, immersive sound.",
            },
            {
              title: "Long Battery Life",
              desc: "Up to 45 hours of playback keeps your music going all day and night.",
            },
            {
              title: "Premium Sound Quality",
              desc: "Hi-Res audio drivers deliver crystal-clear sound across all frequencies.",
            },
            {
              title: "Comfortable Fit",
              desc: "Memory foam cushions and ergonomic design for all-day comfort.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border rounded-xl p-6"
            >
              <h3 className="font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Real experiences from real music lovers
          </p>

          <div className="space-y-6">
            {[
              {
                name: "Michael Chen",
                date: "Dec 2025",
                rating: 5,
                review:
                  "These are hands down the best headphones I've ever owned. The noise cancellation is phenomenal.",
              },
              {
                name: "Sarah Johnson",
                date: "Jan 2026",
                rating: 5,
                review:
                  "Worth every penny! The battery life is incredible and they are super comfortable.",
              },
              {
                name: "David Martinez",
                date: "Jan 2026",
                rating: 4,
                review:
                  "Great headphones overall. ANC is excellent and sound quality is very good.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-6"
              >
                {renderStars(item.rating)}

                <p className="text-gray-700 mb-4">
                  "{item.review}"
                </p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>{item.name}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
