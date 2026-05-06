import axios from "axios";
import Cookies from "js-cookie";

// ─── Admin uses same api instance with token ──────────────────────
const adminApi = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

adminApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// ─── Orders ───────────────────────────────────────────────────────
export const fetchOrders = async () => {
  const res = await adminApi.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await adminApi.put(`/orders/${orderId}/status`, { status });
  return res.data.data;
};

// ─── Users ────────────────────────────────────────────────────────
export const fetchUsers = async () => {
  const res = await adminApi.get("/auth/users");
  return res.data.data;
};

// ─── Products ─────────────────────────────────────────────────────
export const fetchProducts = async () => {
  const res = await adminApi.get("/products");
  return res.data.data;
};

export const createProduct = async (productData) => {
  const res = await adminApi.post("/products", productData);
  return res.data.data;
};

export const updateProduct = async (id, productData) => {
  const res = await adminApi.put(`/products/${id}`, productData);
  return res.data.data;
};

export const deleteProduct = async (id) => {
  const res = await adminApi.delete(`/products/${id}`);
  return res.data;
};

export default adminApi;