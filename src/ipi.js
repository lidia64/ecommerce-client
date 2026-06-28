import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;


export const getProducts = (params) =>
  api.get("/products", { params });

export const getProduct = (id) =>
  api.get(`/products/${id}`);


export const getCategories = () =>
  api.get("/categories");


export const getCart = () =>
  api.get("/cart");

export const addToCart = (data) =>
  api.post("/cart", data);

export const updateCart = (id, data) =>
  api.put(`/cart/${id}`, data);

export const deleteCart = (id) =>
  api.delete(`/cart/${id}`);


export const placeOrder = (data) =>
  api.post("/orders", data);

export const getOrders = () =>
  api.get("/orders");