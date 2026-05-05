export const fetchOrders = async () => {
  const res = await fetch("http://localhost:5000/orders");
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
};
