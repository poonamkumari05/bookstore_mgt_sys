import api from "./api";

/**
 * FETCH ALL ADDRESSES
 * Returns all addresses for the currently logged-in user
 */
export const getAddresses = () => api.get("/addresses");

/**
 * FETCH SINGLE ADDRESS
 * Returns a specific address by its ID
 */
export const getAddressById = (id) => api.get(`/addresses/${id}`);

/**
 * CREATE NEW ADDRESS
 * @param {Object} data - { city, state, pincode }
 */
export const createAddress = (data) => api.post("/addresses", data);

/**
 * UPDATE EXISTING ADDRESS
 * @param {number} id - The address_id
 * @param {Object} data - { city, state, pincode }
 */
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);

/**
 * DELETE ADDRESS
 * @param {number} id - The address_id
 */
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);