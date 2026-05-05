export const getOrderStatusStats = (orders) => {
  const statusCount = {
    Placed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0
  };

  orders.forEach(order => {
    if (statusCount[order.status] !== undefined) {
      statusCount[order.status]++;
    }
  });

  return Object.entries(statusCount).map(([name, value]) => ({
    name,
    value
  }));
};
