import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const BASE_IMAGE_URL = "http://localhost:5000";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    image,
    title,
    price,
    rating,
    noiseReduction,
    reviews = []
  } = product;

  const maxStars = 5;

  // FIX IMAGE URL
  const imageSrc = image?.startsWith("http")
    ? image
    : `${BASE_IMAGE_URL}${image}`;

  // FIND MAJORITY RATING (MODE)
  let displayRating = rating || 0;

  if (reviews.length > 0) {
    const count = {};

    reviews.forEach(r => {
      const star = Number(r.rating);
      count[star] = (count[star] || 0) + 1;
    });

    let maxCount = 0;

    Object.entries(count).forEach(([star, c]) => {
      if (c > maxCount) {
        maxCount = c;
        displayRating = Number(star);
      }
    });
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <Link to={`/product/${id}`}>
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-100 object-cover rounded-t-lg"
        />
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(maxStars)].map((_, index) =>
            index < displayRating ? (
              <FaStar key={index} className="text-yellow-400" />
            ) : (
              <FaRegStar key={index} className="text-gray-300" />
            )
          )}

          <span className="text-sm text-gray-500 ml-2">
            {displayRating} ⭐ ({reviews.length} reviews) •{" "}
            {noiseReduction ? "ANC" : "No ANC"}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold">₹{price}</p>

          <Link
            to={`/product/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;