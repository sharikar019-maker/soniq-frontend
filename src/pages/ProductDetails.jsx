import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/shopContext";
import { AuthContext } from "../Context/AuthContext";
import { getProductById } from "../api/productService";

const BASE_IMAGE_URL = "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ addReview added
  const { addToCart, addReview } = useContext(ShopContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(Number(id));

        if (!data) throw new Error("Product not found");

        const savedReviews = localStorage.getItem(`reviews_${id}`);

        setProduct({
          ...data,
          reviews: savedReviews
            ? JSON.parse(savedReviews)
            : data.reviews || []
        });

      } catch (err) {
        console.error(err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20">Loading product...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">
        {error}
      </p>
    );
  }

  const { image, title, price, description, reviews = [], specs } = product;

  const imageSrc = image?.startsWith("http")
    ? image
    : `${BASE_IMAGE_URL}${image}`;

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Login to add review");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: user.name || user.email,
      rating: Number(rating),
      comment
    };

    const updatedReviews = [...reviews, newReview];

    const updatedProduct = {
      ...product,
      reviews: updatedReviews
    };

    setProduct(updatedProduct);

    // SAVE REVIEWS (your existing logic)
    localStorage.setItem(
      `reviews_${product.id}`,
      JSON.stringify(updatedReviews)
    );

    // ✅ UPDATE GLOBAL PRODUCTS (this fixes ProductCard)
    addReview(product.id, newReview);

    setComment("");
    setRating(5);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={imageSrc}
          alt={title}
          className="w-full rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>

          <p className="text-2xl font-semibold mb-4">
            ₹{price}
          </p>

          <p className="text-gray-600 mb-6">
            {description}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {specs && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Technical Specifications
          </h2>

          <div className="border rounded-lg divide-y">
            {Object.entries(specs).map(([key, value]) => (
              <Spec key={key} label={key} value={value} />
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-lg">
                <p className="font-medium">{review.name}</p>

                <p className="text-yellow-500">
                  {"★".repeat(review.rating)}
                </p>

                <p className="text-gray-600 mt-1">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD REVIEW */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">
          Write a Review
        </h3>

        <form
          onSubmit={handleReviewSubmit}
          className="space-y-4 max-w-md"
        >
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <textarea
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

const Spec = ({ label, value }) => (
  <div className="flex justify-between p-4">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default ProductDetails;