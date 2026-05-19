import { useEffect, useState } from "react";
import adminApi from "../fetch/adminapi";
import StatCard from "../components/StatCard";
import MonthlyProfitChart from "../components/MonthlyProfitChart";
import OrderStatusChart from "../components/OrderStatusChart";
import getOrderStatusStats from "../utils/orderStats";
import getMonthlyProfit from "../utils/monthlyProfit";

const Dashboard = () => {
  const [orders, setOrders]               = useState([]);
  const [users, setUsers]                 = useState({ total: 0, newThisMonth: 0 });
  const [statusData, setStatusData]       = useState([]);
  const [monthlyProfit, setMonthlyProfit] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // ✅ allSettled — one failure never kills the other
        const [ordersResult, usersResult] = await Promise.allSettled([
          adminApi.get("/orders"),
          adminApi.get("/users/stats"),
        ]);

        if (ordersResult.status === "fulfilled") {
          const fetchedOrders = ordersResult.value.data?.data || [];
          setOrders(fetchedOrders);
          setStatusData(getOrderStatusStats(fetchedOrders));
          setMonthlyProfit(getMonthlyProfit(fetchedOrders));
        } else {
          console.error("Orders fetch failed:", ordersResult.reason);
        }

        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value.data?.data || { total: 0, newThisMonth: 0 });
        } else {
          console.error("User stats fetch failed:", usersResult.reason);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalOrders  = orders.length;

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          color="green"   // ✅ color prop, not bg — full class resolved in StatCard
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={users.total ?? 0}
          color="indigo"
        />
        <StatCard
          title="New Users (30d)"
          value={users.newThisMonth ?? 0}
          color="pink"
        />
      </div>

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyProfitChart data={monthlyProfit} />
        <OrderStatusChart data={statusData} />
      </div>
    </div>
  );
};

export default Dashboard;