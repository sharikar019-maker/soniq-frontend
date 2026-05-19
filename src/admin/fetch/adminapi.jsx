import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "adminToken"; 


const adminApi = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, 
});


adminApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true } 
        );
        const newToken = res.data.accessToken;
        Cookies.set(TOKEN_KEY, newToken, { sameSite: "strict" });
        original.headers.Authorization = `Bearer ${newToken}`;
        return adminApi(original); 
      } catch {
        
        Cookies.remove(TOKEN_KEY);
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);




export const adminLogin = async (email, password) => {
  const res = await adminApi.post("/auth/login", { email, password });
  const { accessToken, data: user } = res.data;

  if (user.role !== "admin") throw new Error("Access denied: not an admin");

  
  Cookies.set(TOKEN_KEY, accessToken, { sameSite: "strict" });
  return user;
};

export const adminLogout = async () => {
  await adminApi.post("/auth/logout");
  Cookies.remove(TOKEN_KEY);
};





export const fetchUsers = async ({ page = 1, limit = 20, status, search } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (search) params.search = search;
  const res = await adminApi.get("/users", { params });
  return res.data; 
};

export const fetchUserStats = async () => {
  const res = await adminApi.get("/users/stats");
  return res.data.data; 
};


export const fetchUserById = async (id) => {
  const res = await adminApi.get(`/users/${id}`);
  return res.data.data;
};


export const updateUserStatus = async (id, status) => {
  const res = await adminApi.patch(`/users/${id}/status`, { status });
  return res.data.data;
};





export const fetchOrders = async ({ page = 1, limit = 20, status } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  const res = await adminApi.get("/orders", { params });
  return res.data; 
};


export const fetchOrderById = async (id) => {
  const res = await adminApi.get(`/orders/${id}`);
  return res.data.data;
};


export const updateOrderStatus = async (id, status) => {
  const res = await adminApi.patch(`/orders/${id}/status`, { status });
  return res.data.data;
};





export const fetchProducts = async ({ page = 1, limit = 12, category, search } = {}) => {
  const params = { page, limit };
  if (category) params.category = category;
  if (search)   params.search   = search;
  const res = await adminApi.get("/products", { params });
  return res.data; 
};


export const fetchProductById = async (id) => {
  const res = await adminApi.get(`/products/${id}`);
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