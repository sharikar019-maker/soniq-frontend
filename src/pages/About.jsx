import React from "react";

const About = () => {
  return (
    <div className="text-gray-800">

      
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          About SONIQ
        </h1>
        <p className="max-w-2xl mx-auto text-gray-300">
          We're on a mission to deliver exceptional audio experiences through
          innovative technology, premium craftsmanship, and unwavering
          commitment to quality.
        </p>
      </section>

      
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2018, SONIQ was born from a simple belief: everyone
            deserves to experience music the way artists intended it to be
            heard.
          </p>
          <p className="text-gray-600">
            What started as a small workshop has grown into a global brand
            trusted by professionals and music lovers worldwide.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D"
          alt="Headphones"
          className="rounded-xl shadow-lg"
        />
      </section>

      
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-10">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Innovation",
                desc: "Pushing the boundaries of audio technology."
              },
              {
                title: "User-Centric",
                desc: "Designed with real user feedback and research."
              },
              {
                title: "Quality",
                desc: "Premium materials and rigorous testing."
              },
              {
                title: "Passion",
                desc: "A genuine love for music and sound."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Why Choose SONIQ?
        </h2>

        <div className="space-y-4">
          {[
            {
              title: "Engineered for Excellence",
              desc: "Designed and tested by audio experts."
            },
            {
              title: "Trusted by Professionals",
              desc: "Used in studios and by musicians worldwide."
            },
            {
              title: "Customer-First Approach",
              desc: "Easy returns, warranties, and support."
            },
            {
              title: "Sustainable Practices",
              desc: "Responsible sourcing and packaging."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border shadow-sm"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Experience the SONIQ Difference
        </h2>
        <p className="text-gray-300 mb-6">
          Discover headphones that combine sound quality, comfort, and
          innovation.
        </p>
        <button className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Shop Now
        </button>
      </section>

    </div>
  );
};

export default About;
