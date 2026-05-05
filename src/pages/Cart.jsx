import { useContext, useState } from "react";
import { ShopContext } from "../Context/shopContext";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000";

const Cart = () => {
  const {
    cart,
    total,
    quantity,
    discount,
    finalTotal,
    coupon,
    increaseAmt,
    decreaseAmt,
    removeItem,
    checkoutCart,
    applyCoupon,
  } = useContext(ShopContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput.trim());

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Coupon applied successfully");
    setCouponInput("");
  };

  const placeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      // place order 
      
      const placeOrder = () => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (cart.length === 0) {
    toast.warning("Cart is empty");
    return;
  }

  checkoutCart(); 
  navigate("/payment");
};


      checkoutCart(); 
      navigate("/payment");

    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">
          Your cart is empty 🛒
        </h2>
        <Link to="/shop" className="bg-black text-white px-5 py-2 rounded">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-20">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center p-4 shadow rounded mb-4"
        >
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p>₹{item.price} × {item.amount}</p>
            <p className="font-medium">
              ₹{item.price * item.amount}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => decreaseAmt(item.id)}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              -
            </button>

            <span>{item.amount}</span>

            <button
              onClick={() => increaseAmt(item.id)}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              +
            </button>

            <button
              onClick={() => removeItem(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Coupon */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter coupon"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          disabled={coupon}
          className="border px-3 py-2 mr-2"
        />

        <button
          onClick={handleApplyCoupon}
          disabled={coupon}
          className={`px-4 py-2 rounded ${
            coupon
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          {coupon ? "Coupon Applied" : "Apply Coupon"}
        </button>
      </div>

      <div className="mt-8">
        <p>Subtotal ({quantity} items): ₹{total}</p>
        <p>Discount: -₹{discount}</p>
        <p className="font-bold text-lg">
          Final Total: ₹{finalTotal}
        </p>
      </div>

      <button
        onClick={placeOrder}
        disabled={placingOrder}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
      >
        {placingOrder ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default Cart;
