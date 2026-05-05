import { useContext } from "react";

import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Review from "../components/Review";
import Footer from "../components/Footer";
import { ShopContext } from "../Context/shopContext";

const Home = () => {
  const { products } = useContext(ShopContext);

  
  const latestProducts = products.slice(0, 3);

  return (
    <>
      
      <Hero />

      <section className="max-w-[1200px] mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-center mb-2">
          Latest Models
        </h2>

        <p className="text-gray-500 text-center mb-10">
          Check out our newest arrivals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Review />
      <Footer />
    </>
  );
};

export default Home;
