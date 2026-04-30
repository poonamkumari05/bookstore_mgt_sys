import api from "./api";

// get cart
export const getCart = () => api.get("/cart");

// add
export const addToCart = (data) => api.post("/cart/add", data);

// update
export const updateCart = (id, quantity) =>
  api.patch(`/cart/update/${id}`, { quantity });

// remove
export const removeFromCart = (id) =>
  api.delete(`/cart/remove/${id}`);