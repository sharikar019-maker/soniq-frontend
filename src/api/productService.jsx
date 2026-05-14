import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        
        Cookies.set("token", newToken, { secure: true, sameSite: "Strict" });

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


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


export const fetchCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCartApi = async (productId, quantity) => {
  const res = await api.post("/cart", { productId, quantity });
  return res.data;
};

export const updateCartItemApi = async (productId, quantity) => {
  const res = await api.put(`/cart/${productId}`, { quantity });
  return res.data;
};

export const removeFromCartApi = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};

export const clearCartApi = async () => {
  const res = await api.delete("/cart");
  return res.data;
};


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