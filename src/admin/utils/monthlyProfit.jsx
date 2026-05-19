const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const getMonthlyProfit = (orders = []) => {
  if (!Array.isArray(orders) || orders.length === 0) return [];
  const profitMap = {};
  orders.forEach((order) => {
    if (order.status !== "delivered") return;
    const date = new Date(order.createdAt);
    if (isNaN(date.getTime())) return;
    const label = `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    profitMap[label] = (profitMap[label] || 0) + (order.totalPrice || 0);
  });
  return Object.entries(profitMap)
    .map(([month, profit]) => ({ month, profit }))
    .sort((a, b) => new Date("1 " + a.month) - new Date("1 " + b.month));
};
export default getMonthlyProfit;