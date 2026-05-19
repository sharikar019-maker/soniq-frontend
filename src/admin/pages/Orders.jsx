import { useEffect, useState } from "react";
import adminApi from "../fetch/adminapi";


const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_FILTERS = ["All", ...ORDER_STATUSES];

const Orders = () => {
  const [orders, setOrders]       = useState([]);
  const [filter, setFilter]       = useState("All");
  const [loading, setLoading]     = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetchOrders();
   
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
     
      const res = await adminApi.get("/orders");
      
      const fetched = res.data?.data || [];

      const sorted = [...fetched].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      
      await adminApi.patch(`/orders/${orderId}/status`, { status: newStatus });

      
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      const message = err.response?.data?.message || "Failed to update order status";
      alert(message);
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

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      {/* Status filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              filter === status
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-t text-sm hover:bg-gray-50">
                  {/*  _id not id */}
                  <td className="p-4 font-mono text-xs">{order._id}</td>

                  {/* ✅ user is populated object from $lookup — show name + email */}
                  <td className="p-4">
                    <p className="font-medium">{order.user?.name || "—"}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || "—"}</p>
                  </td>

                  {/*  item.title exists in your orderItemSchema */}
                  <td className="p-4">
                    {order.items?.map((item) => (
                      <div key={item._id} className="text-xs text-gray-700">
                        {item.title} × {item.quantity} {/* ✅ quantity not amount */}
                      </div>
                    ))}
                  </td>

                  {/*  totalPrice not totalAmount */}
                  <td className="p-4 font-semibold">₹{order.totalPrice}</td>

                  <td className="p-4">{order.paymentMethod}</td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm capitalize disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-gray-600">{formatDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;