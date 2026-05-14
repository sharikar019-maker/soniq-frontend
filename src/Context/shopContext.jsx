import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";

import {
  getAllProducts,
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

  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
  });

  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  
  const updateCartState = (data) => {
    setCart({
      items: data?.data?.items ?? [],
      totalPrice: data?.data?.totalPrice ?? 0,
    });
  };

  
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

  
  const loadCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }

    try {
      const data = await fetchCart();
      updateCartState(data);
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCart({ items: [], totalPrice: 0 });
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  
  const addToCart = async (product, qty = 1) => {
    if (!user) return;

    try {
      const updated = await addToCartApi(product._id, qty);
      updateCartState(updated);
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  
  const increaseAmt = async (productId) => {
    
    if (!user) return;

    
    const item = cart.items?.find(
      (i) => i.product && i.product._id.toString() === productId.toString()
    );

    if (!item) return;

    try {
      const updated = await updateCartItemApi(productId, item.quantity + 1);
      updateCartState(updated);
    } catch (err) {
      console.error("Increase qty failed", err);
    }
  };

 
  const decreaseAmt = async (productId) => {
    
    if (!user) return;

    
    const item = cart.items?.find(
      (i) => i.product && i.product._id.toString() === productId.toString()
    );

    if (!item) return;

    try {
      if (item.quantity <= 1) {
        const updated = await removeFromCartApi(productId);
        updateCartState(updated);
      } else {
        const updated = await updateCartItemApi(productId, item.quantity - 1);
        updateCartState(updated);
      }
    } catch (err) {
      console.error("Decrease qty failed", err);
    }
  };

  
  const removeItem = async (productId) => {
    
    if (!user) return;

    try {
      const updated = await removeFromCartApi(productId);
      updateCartState(updated);
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  
  const clearCart = async () => {
    try {
      await clearCartApi();

      setCart({ items: [], totalPrice: 0 });
      setDiscount(0);
      setCoupon(null);
    } catch (err) {
      console.error("Clear cart failed", err);
     
      await loadCart();
    }
  };

  
  const finalTotal = Math.max((cart.totalPrice || 0) - discount, 0);

  const quantity =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  
  const applyCoupon = (code) => {
    if (!user) {
      return { success: false, message: "Login required" };
    }

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
        discount,
        finalTotal,
        coupon,
        quantity,

       
        addToCart,
        increaseAmt,
        decreaseAmt,
        removeItem,
        clearCart,
        applyCoupon,

        
        loadCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;