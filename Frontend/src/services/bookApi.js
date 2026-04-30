import api from "./api";

// PUBLIC
export const getBooks = () => api.get("/books");

export const searchBooks = (query) =>
  api.get(`/books/search?query=${query}`);

export const getBookById = (id) =>
  api.get(`/books/${id}`);


// ADMIN

// ➕ Add Book
export const createBook = (data) =>
  api.post("/books", data);

// ✏️ Update full book
export const updateBook = (id, data) =>
  api.put(`/books/${id}`, data);

// 💰 Update only price
export const updateBookPrice = (id, price) =>
  api.patch(`/books/${id}/price`, { price });

// ❌ Delete book
export const deleteBook = (id) =>
  api.delete(`/books/${id}`);