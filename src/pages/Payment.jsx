import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/shopContext";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  placeOrderApi,
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey,
} from "../api/productService";

const Payment = () => {
  const { cart, clearCart, finalTotal, discount } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [method, setMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const total = cart.totalPrice || 0;

  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const key = `addresses_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(key)) || [];

    if (saved.length === 0) {
      toast.warning("Please add an address before checkout");
      navigate("/add-address");
      return;
    }

    setAddresses(saved);
    setSelectedAddress(saved[0]);
  }, [user, navigate]);

  
  const formatAddress = (addr) => {
    if (!addr) return null;

    
    if (addr.street) return addr;

    
    const parts = addr.address?.split(",").map((p) => p.trim()) || [];

    
    if (!parts[0] || !parts[1] || !parts[4]) {
      toast.error("Address format is invalid. Please re-add your address.");
      return null;
    }

    return {
      street:     parts[0],
      city:       parts[1],
      state:      parts[2] || "N/A",
      postalCode: parts[3] || "000000",
      country:    parts[4],
    };
  };

  
  const handleCOD = async () => {
    
    const formattedAddress = formatAddress(selectedAddress);
    if (!formattedAddress) return;

    try {
      setLoading(true);
      await placeOrderApi({
        shippingAddress: formattedAddress,
        paymentMethod: "COD",
      });

      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  
  const handleRazorpay = async () => {
    
    const formattedAddress = formatAddress(selectedAddress);
    if (!formattedAddress) return;

    
    if (!window.Razorpay) {
      toast.error("Payment service unavailable. Please refresh and try again.");
      return;
    }

    try {
      setLoading(true);

      const keyId = await getRazorpayKey();
      const razorpayOrder = await createRazorpayOrder(finalTotal);

      const options = {
        key:      keyId,
        amount:   razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.razorpayOrderId,
        name:        "HeadPhone Store",
        description: "Order Payment",
        prefill: {
          name:    user.name,
          email:   user.email,
          contact: user.phone || "",
        },
        theme: { color: "#2563eb" },

        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress:   formattedAddress,
            });

            await clearCart();
            toast.success("Payment successful! Order placed.");
            
            setLoading(false);
            navigate("/profile");
          } catch (err) {
           
            setLoading(false);
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.warning("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  
  const handlePayment = () => {
    if (!method) {
      toast.warning("Please select a payment method");
      return;
    }
    if (!selectedAddress) {
      toast.warning("Please select a delivery address");
      return;
    }

    if (method === "cod") {
      handleCOD();
    } else {
      handleRazorpay();
    }
  };

  
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold">No items to checkout</h2>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 bg-black text-white px-5 py-2 rounded"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

     
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        {addresses.map((addr, index) => (
          <label
            
            key={addr.id ?? index}
            className="flex items-start gap-2 mb-2 border p-3 rounded cursor-pointer"
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress?.id === addr.id}
              onChange={() => setSelectedAddress(addr)}
              className="mt-1"
            />
            <div>
              <p className="font-medium">{addr.label}</p>
              <p className="text-sm text-gray-600">{addr.address}</p>
            </div>
          </label>
        ))}
      </div>

      
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between mb-2 text-sm"
          >
            <span>
              {item.product.title} × {item.quantity}
            </span>
           
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-3" />
        <p className="text-sm">Subtotal: ₹{total}</p>
        {discount > 0 && (
          <p className="text-sm text-green-600">Discount: −₹{discount}</p>
        )}
        <p className="font-bold text-lg mt-1">Final Total: ₹{finalTotal}</p>
      </div>

     
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Payment Method</h3>
        <div className="space-y-2">
          {[
            { value: "card", label: "💳 Credit / Debit Card" },
            { value: "upi",  label: "📱 UPI" },
            { value: "cod",  label: "💵 Cash on Delivery" },
          ].map((m) => (
            <label
              key={m.value}
              className="flex items-center gap-2 border p-3 rounded cursor-pointer"
            >
              <input
                type="radio"
                name="payment"
                value={m.value}
                checked={method === m.value}
                onChange={() => setMethod(m.value)}
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : "Confirm & Pay"}
      </button>
    </div>
  );
};

export default Payment;