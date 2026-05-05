import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/orders";

const ORDER_STATUSES = [
  "Placed",
  "Shipped",
  "Delivered"
];

const STATUS_FILTERS = ["All", ...ORDER_STATUSES];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(BASE_URL);

      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await axios.patch(`${BASE_URL}/${orderId}`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Invalid";

    return date.toLocaleDateString("en-IN");
  };

  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium
            ${
              filter === status
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer Email</th>
              <th className="p-4">Items</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Discount Amount</th>
              <th className="p-4">Coupon</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ordered Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t text-sm hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{order.id}</td>

                <td className="p-4">{order.userEmail}</td>

                <td className="p-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="text-xs text-gray-700">
                      {item.title} × {item.amount}
                    </div>
                  ))}
                </td>

                <td className="p-4 font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="p-4 text-green-600">
                  -₹{order.discountApplied || 0}
                </td>

                <td className="p-4">
                  {order.couponCode ? order.couponCode : "—"}
                </td>

                <td className="p-4">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4 text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;