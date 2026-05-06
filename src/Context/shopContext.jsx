import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { getAllProducts } from "../api/productService";
import {
  fetchCart,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from "../api/productService";
import { AuthContext } from "./AuthContext";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // cart shape from backend: { items: [{product: {...}, quantity: N}], totalPrice: N }
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  // ─── Fetch Products ───────────────────────────────────────────────
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // ─── Fetch Cart when user logs in ─────────────────────────────────
  const loadCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    try {
      const data = await fetchCart();
      setCart(data || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Cart fetch failed", err);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ─── Cart Actions ─────────────────────────────────────────────────
  const addToCart = async (product, qty = 1) => {
    if (!user) return;
    try {
      const updated = await addToCartApi(product._id, qty);
      setCart(updated);
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  const increaseAmt = async (productId) => {
    const item = cart.items?.find((i) => i.product._id === productId);
    if (!item) return;
    try {
      const updated = await updateCartItemApi(productId, item.quantity + 1);
      setCart(updated);
    } catch (err) {
      console.error("Increase qty failed", err);
    }
  };

  const decreaseAmt = async (productId) => {
    const item = cart.items?.find((i) => i.product._id === productId);
    if (!item) return;
    try {
      if (item.quantity <= 1) {
        // remove item if qty would go to 0
        const updated = await removeFromCartApi(productId);
        setCart(updated);
      } else {
        const updated = await updateCartItemApi(productId, item.quantity - 1);
        setCart(updated);
      }
    } catch (err) {
      console.error("Decrease qty failed", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const updated = await removeFromCartApi(productId);
      setCart(updated);
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
      setCart({ items: [], totalPrice: 0 });
      setCheckoutItems([]);
      setDiscount(0);
      setCoupon(null);
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  const checkoutCart = () => {
    setCheckoutItems(cart.items); // items have backend shape
  };

  // ─── Derived Totals ───────────────────────────────────────────────
  const total = cart.totalPrice || 0;
  const finalTotal = Math.max(total - discount, 0);
  const quantity =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // ─── Coupon ───────────────────────────────────────────────────────
  const applyCoupon = (code) => {
    if (!user) return { success: false, message: "Login required" };

    const normalizedCode = code.trim().toUpperCase();
    if (normalizedCode !== "SAVE200") {
      return { success: false, message: "Invalid coupon" };
    }

    const expiryDate = new Date("2026-06-15T23:59:59");
    if (new Date() > expiryDate) {
      return { success: false, message: "Coupon expired" };
    }

    const usageKey = `coupon_${normalizedCode}_${user.email}`;
    if (localStorage.getItem(usageKey)) {
      return { success: false, message: "You already used this coupon" };
    }

    setDiscount(200);
    setCoupon(normalizedCode);
    localStorage.setItem(usageKey, "used");
    return { success: true };
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        loading,
        cart,
        checkoutItems,
        total,
        discount,
        finalTotal,
        coupon,
        quantity,
        addToCart,
        increaseAmt,
        decreaseAmt,
        removeItem,
        clearCart,
        checkoutCart,
        applyCoupon,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;