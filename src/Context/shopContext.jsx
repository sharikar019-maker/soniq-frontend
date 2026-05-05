import { createContext, useEffect, useState, useContext } from "react";
import { getAllProducts } from "../api/productService";
import { AuthContext } from "./AuthContext";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  const cartKey = user ? `cart_${user.email}` : null;

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load Cart
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const savedCart = localStorage.getItem(cartKey);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user]);

  // Persist Cart
  useEffect(() => {
    if (user && cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart]);

  // Derived Totals
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );

  const finalTotal = Math.max(total - discount, 0);

  const quantity = cart.reduce((sum, item) => sum + item.amount, 0);

  // Cart Methods
  const addToCart = (product, qty = 1) => {
    if (!user) return;

    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, amount: p.amount + qty }
            : p
        );
      }
      return [...prev, { ...product, amount: qty }];
    });
  };

  const removeItem = id => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const clearCart = () => {
    if (cartKey) localStorage.removeItem(cartKey);
    setCart([]);
    setCheckoutItems([]);
    setDiscount(0);
    setCoupon(null);
  };

  const checkoutCart = () => {
    setCheckoutItems(cart);
  };

  // apply coupon
  const applyCoupon = (code) => {
    if (!user) {
      return { success: false, message: "Login required" };
    }

    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode !== "SAVE200") {
      return { success: false, message: "Invalid coupon" };
    }

    const expiryDate = new Date("2026-03-15T23:59:59");
    const today = new Date();

    if (today > expiryDate) {
      return { success: false, message: "Coupon expired" };
    }

    const usageKey = `coupon_${normalizedCode}_${user.email}`;
    const alreadyUsed = localStorage.getItem(usageKey);

    if (alreadyUsed) {
      return { success: false, message: "You already used this coupon" };
    }

    setDiscount(200);
    setCoupon(normalizedCode);

    localStorage.setItem(usageKey, "used");

    return { success: true };
  };

  // ===============================
  // ADD REVIEW (NEW FUNCTION)
  // ===============================
  const addReview = (productId, review) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedReviews = [...(product.reviews || []), review];

          // persist reviews
          localStorage.setItem(
            `reviews_${productId}`,
            JSON.stringify(updatedReviews)
          );

          return {
            ...product,
            reviews: updatedReviews
          };
        }

        return product;
      })
    );
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        cart,
        checkoutItems,
        total,
        discount,
        finalTotal,
        coupon,
        addToCart,
        removeItem,
        clearCart,
        checkoutCart,
        applyCoupon,
        quantity,
        addReview
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;