// ✅ Full class strings in map — Tailwind can detect these at build time
const COLOR_MAP = {
  green:  "bg-green-500",
  blue:   "bg-blue-500",
  indigo: "bg-indigo-500",
  pink:   "bg-pink-500",
  red:    "bg-red-500",
  yellow: "bg-yellow-500",
};

const StatCard = ({ title, value, color }) => (
  <div className={`${COLOR_MAP[color] || "bg-gray-500"} text-white rounded-lg p-5 shadow`}>
    <p className="text-sm opacity-90">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
);

export default StatCard;

