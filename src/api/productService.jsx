import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000
});

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
};

