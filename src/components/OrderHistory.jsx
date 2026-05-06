import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { getMyOrders } from "../api/productService";
import { toast } from "react-toastify";
import api from "../api/productService";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  const confirmCancel = (orderId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-medium mb-2">Cancel this order?</p>
          <div className="flex gap-2">
            <button
              onClick={() => { closeToast(); handleCancel(orderId); }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Yes, Cancel
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
            >
              No, Keep it
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleCancel = async (orderId) => {
    try {
      setCancellingId(orderId);
      await api.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to cancel order";
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  const handleInvoice = (order) => {
    const itemLines = order.items
      .map((i) => `  ${i.title} × ${i.quantity}  →  ₹${i.price * i.quantity}`)
      .join("\n");

    const content = `
========================================
         SONIQ - ORDER INVOICE
========================================

Order ID  : ${order._id}
Date      : ${new Date(order.createdAt).toLocaleDateString()}
Status    : ${order.status.toUpperCase()}
Payment   : ${order.paymentMethod}

----------------------------------------
ITEMS:
${itemLines}
----------------------------------------

Total     : ₹${order.totalPrice}

Delivery Address:
${order.shippingAddress?.street}, ${order.shippingAddress?.city}
${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}
${order.shippingAddress?.country}

========================================
     Thank you for shopping with SONIQ!
========================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${order._id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (!user) return <p className="p-4">Please login to view orders.</p>;
  if (loading) return <p className="p-4">Loading orders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 mb-4 shadow-sm">

            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <ul className="text-sm text-gray-700 mb-3 space-y-1">
              {order.items.map((item) => (
                <li key={item._id} className="flex justify-between">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="text-sm text-gray-500 mb-3">
              <span>Payment: {order.paymentMethod}</span>
              {order.isPaid && (
                <span className="ml-3 text-green-600 font-medium">✓ Paid</span>
              )}
            </div>

            <p className="font-semibold mb-3">Total: ₹{order.totalPrice}</p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleInvoice(order)}
                className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
              >
                📄 Download Invoice
              </button>

              {order.status === "pending" && (
                <button
                  onClick={() => confirmCancel(order._id)} // ✅ fixed
                  disabled={cancellingId === order._id}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    cancellingId === order._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
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