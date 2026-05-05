import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000/orders";

const CANCELLABLE_STATUSES = ["Placed", "Confirmed"];

const OrderHistory = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}?userEmail=${user.email}`);

      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // run fetch + auto refresh
  useEffect(() => {
    if (!user) return;

    fetchOrders();

    // refresh every 5 seconds to get admin updates
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // cancel order
  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setUpdatingId(orderId);

      await axios.patch(`${BASE_URL}/${orderId}`, {
        status: "Cancelled",
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );

      toast.success("Order cancelled successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setUpdatingId(null);
    }
  };

  // download invoice
  const handleInvoice = (order) => {
    const content = `
SONIQ - Invoice

Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status}

Items:
${order.items.map((i) => `${i.title} × ${i.amount}`).join("\n")}

Total: ₹${order.totalAmount}

Thank you for shopping with SONIQ!
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${order.id}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!user) {
    return <p className="p-4">Please login to view orders.</p>;
  }

  if (loading) {
    return <p className="p-4">Loading orders...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded p-4 mb-4">
            <h3 className="font-semibold mb-1">Order #{order.id}</h3>

            {/* status display */}
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className="font-medium">{order.status}</span> •{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <ul className="text-sm text-gray-700 mb-2">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.title} × {item.amount}
                </li>
              ))}
            </ul>

            <p className="font-semibold mb-3">
              Total: ₹{order.totalAmount}
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleInvoice(order)}
                className="border px-3 py-1 rounded"
              >
                Download Invoice
              </button>

              {CANCELLABLE_STATUSES.includes(order.status) && (
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={updatingId === order.id}
                  className={`px-3 py-1 rounded text-white ${
                    updatingId === order.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500"
                  }`}
                >
                  {updatingId === order.id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;