import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#14b8a6", "#ef4444", "#f97316"];

const OrderStatusChart = ({ data = [] }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-5 flex items-center justify-center h- [360px]">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-2">🛒</p>
          <p className="text-sm">No orders yet</p>
          <p className="text-xs mt-1">Order status breakdown will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-medium mb-4">Order Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusChart;