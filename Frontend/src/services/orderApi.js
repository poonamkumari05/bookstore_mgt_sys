import api from "./api";

// CHECKOUT (create order from cart)
export const checkout = (data) =>
  api.post("/orders/checkout", data);

//  PLACE ORDER (manual order API - optional if used)
export const placeOrder = (data) =>
  api.post("/orders", data);

//  GET MY ORDERS (consumer)
export const getMyOrders = () =>
  api.get("/orders/my-orders");

//  GET ALL ORDERS (admin only)
export const getAllOrders = () =>
  api.get("/orders");

//  UPDATE ORDER STATUS (admin)
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });