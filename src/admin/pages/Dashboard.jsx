import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import MonthlyProfitChart from "../components/MonthlyProfitChart";
import OrderStatusChart from "../components/OrderStatusChart";

import { getOrderStatusStats } from "../utils/orderStats";
import { getMonthlyProfit } from "../utils/monthlyProfit";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [monthlyProfit, setMonthlyProfit] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setStatusData(getOrderStatusStats(data));
        setMonthlyProfit(getMonthlyProfit(data));
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
      });
  }, []);

  // DERIVED STATS   
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const totalOrders = orders.length;

  const uniqueCustomers = new Set(
    orders.map((order) => order.userEmail)
  ).size;

  const newUsers = uniqueCustomers; 
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          bg="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          bg="bg-blue-500"
        />
        <StatCard
          title="Total Customers"
          value={uniqueCustomers}
          bg="bg-indigo-500"
        />
        <StatCard
          title="New Users"
          value={newUsers}
          bg="bg-pink-500"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyProfitChart data={monthlyProfit} />
        <OrderStatusChart data={statusData} />
      </div>
    </div>
  );
};

export default Dashboard;
