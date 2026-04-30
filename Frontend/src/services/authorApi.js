import api from "./api";

// AUTHORS
export const getAuthors = () => api.get("/authors");

export const createAuthor = (data) =>
  api.post("/authors", data);

export const updateAuthor = (id, data) =>
  api.put(`/authors/${id}`, data);

export const deleteAuthor = (id) =>
  api.delete(`/authors/${id}`);

// MAPPING
export const assignAuthorToBook = (data) =>
  api.post("/book-authors/assign", data);

export const removeMapping = (data) =>
  api.delete("/book-authors/remove", { data });