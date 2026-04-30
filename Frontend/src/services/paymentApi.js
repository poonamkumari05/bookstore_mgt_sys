import api from "./api";

// ==============================
// CREATE PAYMENT (USER)
// ==============================
export const createPayment = (data) =>
  api.post("/payments", data);

// ==============================
// GET MY PAYMENTS (USER)
// ==============================
export const getMyPayments = () =>
  api.get("/payments/my-payments");

// ==============================
// GET ALL PAYMENTS (ADMIN)
// ==============================
export const getAllPayments = () =>
  api.get("/payments");