import { useContext, useMemo, useState } from "react";
import { ShopContext } from "../Context/shopContext";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const { products = [], loading } = useContext(ShopContext);

  // FILTER STATE
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [ancOnly, setAncOnly] = useState(false);

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = Number(p.price) || 0;
      const hasANC = Boolean(p.noiseReduction);

      // ⭐ calculate majority rating from reviews
      let rating = Number(p.rating) || 0;

      if (p.reviews && p.reviews.length > 0) {
        const count = {};

        p.reviews.forEach((r) => {
          const star = Number(r.rating);
          count[star] = (count[star] || 0) + 1;
        });

        let maxCount = 0;

        Object.entries(count).forEach(([star, c]) => {
          if (c > maxCount) {
            maxCount = c;
            rating = Number(star);
          }
        });
      }

      return (
        (category === "all" || p.category === category) &&
        price <= maxPrice &&
        rating >= minRating &&
        (!ancOnly || hasANC)
      );
    });
  }, [products, category, maxPrice, minRating, ancOnly]);

  // LOADING STATE
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading products...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* FILTER SIDEBAR */}
      <aside className="bg-gray-100 p-4 rounded space-y-6">
        <h3 className="font-bold text-lg">Filters</h3>

        {/* CATEGORY */}
        <div>
          <p className="font-semibold mb-2">Category</p>
          {["all", "wireless", "wired"].map((cat) => (
            <label key={cat} className="block capitalize">
              <input
                type="radio"
                name="category"
                className="mr-2"
                checked={category === cat}
                onChange={() => setCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        {/* PRICE */}
        <div>
          <p className="font-semibold mb-1">
            Max Price ₹{maxPrice}
          </p>
          <input
            type="range"
            min="300"
            max="1000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* RATING */}
        <div>
          <p className="font-semibold mb-1">Minimum Rating</p>
          <select
            className="w-full p-2 border rounded"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>All</option>
            <option value={4}>4★ & above</option>
            <option value={4.5}>4.5★ & above</option>
          </select>
        </div>

        {/* ANC */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ancOnly}
            onChange={() => setAncOnly((prev) => !prev)}
          />
          Noise Cancellation
        </label>

        {/* RESET */}
        <button
          onClick={() => {
            setCategory("all");
            setMaxPrice(1000);
            setMinRating(0);
            setAncOnly(false);
          }}
          className="w-full bg-black text-white py-2 rounded"
        >
          Clear Filters
        </button>
      </aside>

      {/* PRODUCT GRID */}
      <section className="md:col-span-3">
        <h2 className="text-3xl font-bold mb-6">
          Shop All Headphones
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">
            No products found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;