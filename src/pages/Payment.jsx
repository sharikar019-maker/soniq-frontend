import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/shopContext";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "http://localhost:5000/orders";

const Payment = () => {
  const {
    checkoutItems,
    clearCart,
    finalTotal,
    discount,
    total,
  } = useContext(ShopContext);

  const { user } = useContext(AuthContext);

  const [method, setMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const key = `addresses_${user.email}`;
    const savedAddresses = JSON.parse(localStorage.getItem(key)) || [];

    if (savedAddresses.length === 0) {
      toast.warning("Please add an address before checkout");
      navigate("/add-address");
      return;
    }

    setAddresses(savedAddresses);
    setSelectedAddress(savedAddresses[0]);
  }, [user, navigate]);

  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold">
          No items to checkout
        </h2>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!method) {
      toast.warning("Please select payment method");
      return;
    }

    if (!selectedAddress) {
      toast.warning("Please select delivery address");
      return;
    }

    try {
      const order = {
        userEmail: user.email,
        items: checkoutItems,
        totalAmount: finalTotal,
        originalAmount: total,
        discountApplied: discount,
        paymentMethod: method.toUpperCase(),
        deliveryAddress: selectedAddress,
        status: "Placed",

        // IMPORTANT
        createdAt: new Date().toISOString(),
      };

      await axios.post(BASE_URL, order);

      clearCart();

      toast.success("Order placed successfully");

      navigate("/profile");

    } catch (err) {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      {/* ADDRESS */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select Address</h3>

        {addresses.map((addr) => (
          <label
            key={addr.id}
            className="flex items-start gap-2 mb-2 border p-2 rounded"
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress?.id === addr.id}
              onChange={() => setSelectedAddress(addr)}
            />

            <div>
              <p className="font-medium">{addr.label}</p>
              <p className="text-sm text-gray-600">{addr.address}</p>
            </div>

          </label>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      <div className="mb-4">

        {checkoutItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.title} × {item.amount}</span>
            <span>₹{item.price * item.amount}</span>
          </div>
        ))}

        <hr className="my-3" />

        <p>Subtotal: ₹{total}</p>
        <p>Discount: -₹{discount}</p>

        <p className="font-bold text-lg">
          Final Total: ₹{finalTotal}
        </p>

      </div>

      {/* PAYMENT */}
      <div className="space-y-2">

        {["card", "upi", "cod"].map((m) => (
          <label key={m} className="flex items-center gap-2">

            <input
              type="radio"
              name="payment"
              value={m}
              checked={method === m}
              onChange={() => setMethod(m)}
            />

            {m.toUpperCase()}

          </label>
        ))}

      </div>

      <button
        onClick={handlePayment}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded"
      >
        Confirm Order
      </button>

    </div>
  );
};

export default Payment;