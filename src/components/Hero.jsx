import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/shop");
  };

  return (
    <section className="bg-background min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>

          {/* Promo Badge */}
          <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
             Use code <span className="font-bold">SAVE200</span> & get ₹200 OFF
          </div>

          <h1 className="font-poppins text-5xl md:text-6xl font-bold leading-tight">
            Experience Pure Sound
          </h1>

          <p className="mt-4 text-secondaryText max-w-md text-lg">
            Premium wireless headphones engineered for immersive audio,
            powerful bass, and all-day comfort.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleShopNow}
              className="bg-blue-800 text-white font-bold px-6 py-3 rounded-2xl hover:bg-blue-900 transition"
            >
              Shop Now
            </button>
            </div>

          <p className="mt-3 text-sm text-gray-500">
            *Limited time offer. Applicable on checkout.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src="https://cdn.mos.cms.futurecdn.net/YHZhCuweqmeBEcBcDHsMBk-1200-80.jpg"
            alt="SONIQ Headphones"
            className="w-full max-w-md md:max-w-lg object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;