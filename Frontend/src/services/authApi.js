import api from "./api";

const API = "/auth";

export const loginUser = (data) => api.post(`${API}/login`, data);
export const registerUser = (data) => api.post(`${API}/register`, data);