
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const MonthlyProfitChart = ({ data = [] }) => {
  // ✅ Guard — show message instead of empty/broken chart
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl shadow flex items-center justify-center h- [360px]">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-2">📦</p>
          <p className="text-sm">No delivered orders yet</p>
          <p className="text-xs mt-1">Monthly profit will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Profit</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
          />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Profit"]}
          />
          <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyProfitChart;