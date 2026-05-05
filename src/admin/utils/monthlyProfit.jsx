export const getMonthlyProfit = (orders) => {
  const monthlyMap = {};

  orders.forEach((order) => {
    if (!order.createdAt) return;

    const date = new Date(order.createdAt);
    if (isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = Jan

    const key = `${year}-${month}`;

    monthlyMap[key] =
      (monthlyMap[key] || 0) + order.totalAmount;
  });

  return Object.entries(monthlyMap)
    .sort((a, b) => {
      const [yearA, monthA] = a[0].split("-").map(Number);
      const [yearB, monthB] = b[0].split("-").map(Number);

      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    })
    .map(([key, profit]) => {
      const [year, month] = key.split("-").map(Number);

      const label = new Date(year, month).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      return {
        month: label,
        profit,
      };
    });
};