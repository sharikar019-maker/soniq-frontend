const getOrderStatusStats = (orders = []) => {
  if (!Array.isArray(orders)) return [];
  const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  orders.forEach((order) => {
    if (order.status && counts[order.status] !== undefined) counts[order.status]++;
  });
  return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
};
export default getOrderStatusStats;