import { useContext, useState } from "react";
import { ShopContext } from "../Context/shopContext";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cart,
    quantity,
    discount,
    finalTotal,
    coupon,
    increaseAmt,
    decreaseAmt,
    removeItem,
    applyCoupon,
  } = useContext(ShopContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");

  
  const total = cart.totalPrice || 0;

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput.trim());
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Coupon applied!");
    setCouponInput("");
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/payment");
  };

  
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛒</h2>
        <Link to="/shop" className="bg-black text-white px-5 py-2 rounded">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-20">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

     
      {cart.items.map((item) => {
        const product = item.product;

        if (!product) return null;

        const productId = product._id;

        return (
          <div
            key={productId}
            className="flex justify-between items-center p-4 shadow rounded mb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{product.title}</h3>
              
                <p className="text-gray-500">₹{item.price} × {item.quantity}</p>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseAmt(productId)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseAmt(productId)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(productId)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}

     
      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          disabled={!!coupon}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={handleApplyCoupon}
          disabled={!!coupon}
          className={`px-4 py-2 rounded ${
            coupon
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-black text-white"
          }`}
        >
          {coupon ? "Applied ✓" : "Apply"}
        </button>
      </div>

     
      <div className="mt-8 space-y-1">
        <p>Subtotal ({quantity} items): ₹{total}</p>
        {discount > 0 && (
          <p className="text-green-600">Discount: −₹{discount}</p>
        )}
        <p className="font-bold text-lg">Final Total: ₹{finalTotal}</p>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded w-full"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;