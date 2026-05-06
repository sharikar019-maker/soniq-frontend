import axios from "axios";
import Cookies from "js-cookie"; // ← use cookies to match AuthContext

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// ─── Attach token from cookies (matches AuthContext) ──────────────
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // ← was localStorage, now cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Handle expired token ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Products ─────────────────────────────────────────────────────
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
};

export const addProductReview = async (productId, reviewData) => {
  const res = await api.post(`/products/${productId}/reviews`, reviewData);
  return res.data.data;
};

// ─── Cart ─────────────────────────────────────────────────────────
export const fetchCart = async () => {
  const res = await api.get("/cart");
  return res.data.data;
};

export const addToCartApi = async (productId, quantity = 1) => {
  const res = await api.post("/cart", { productId, quantity });
  return res.data.data;
};

export const updateCartItemApi = async (productId, quantity) => {
  const res = await api.put(`/cart/${productId}`, { quantity });
  return res.data.data;
};

export const removeFromCartApi = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data.data;
};

export const clearCartApi = async () => {
  const res = await api.delete("/cart");
  return res.data;
};

// ─── Orders ───────────────────────────────────────────────────────
export const placeOrderApi = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.data;
};

// ─── Payment ──────────────────────────────────────────────────────
export const getRazorpayKey = async () => {
  const res = await api.get("/payment/key");
  return res.data.keyId;
};

export const createRazorpayOrder = async (amount) => {
  const res = await api.post("/payment/create-order", { amount });
  return res.data.data;
};

export const verifyPayment = async (paymentData) => {
  const res = await api.post("/payment/verify", paymentData);
  return res.data.data;
};

// ─── Admin ────────────────────────────────────────────────────────
export const getAllUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data.data;
};

export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data.data;
};

export const createProduct = async (productData) => {
  const res = await api.post("/products", productData);
  return res.data.data;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData);
  return res.data.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export default api;