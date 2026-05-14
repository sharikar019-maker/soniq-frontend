import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const BASE_IMAGE_URL = "";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    _id,
    image,
    title,
    price,
    rating,
    noiseReduction,
    reviews = [],
    numReviews = 0, 
  } = product;

  const maxStars = 5;

  const imageSrc = image?.startsWith("http")
    ? image
    : `${BASE_IMAGE_URL}${image}`;

  
  const displayRating = Number(rating) || 0;

  
  const reviewCount = numReviews || reviews.length;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <Link to={`/product/${_id}`}>
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-120 object-cover rounded-t-lg"
        />
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(maxStars)].map((_, index) =>
            index < Math.round(displayRating) ? (
              <FaStar key={index} className="text-yellow-400" />
            ) : (
              <FaRegStar key={index} className="text-gray-300" />
            )
          )}

          <span className="text-sm text-gray-500 ml-2">
            {displayRating} ⭐ ({reviewCount} reviews) •{" "}
            {noiseReduction ? "ANC" : "No ANC"}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold">₹{price}</p>

          <Link
            to={`/product/${_id}`}
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