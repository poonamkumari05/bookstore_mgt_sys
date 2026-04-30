import { useEffect, useState } from "react";
import styles from "./books.module.css";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  updateBookPrice
} from "../../services/bookApi";

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    book_name: "",
    price: "",
    stock: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ➕ ADD / UPDATE BOOK
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateBook(editingId, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        });
        alert("Book updated");
      } else {
        await createBook({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        });
        alert("Book added");
      }

      setForm({ book_name: "", price: "", stock: "" });
      setEditingId(null);
      fetchBooks();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✏️ EDIT BOOK
  const handleEdit = (book) => {
    setForm({
      book_name: book.book_name,
      price: book.price,
      stock: book.stock
    });
    setEditingId(book.book_id);
  };

  // ❌ DELETE BOOK
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await deleteBook(id);
      alert("Deleted");
      fetchBooks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 💰 UPDATE PRICE ONLY
  const handlePriceUpdate = async (id) => {
    const newPrice = prompt("Enter new price");

    if (!newPrice) return;

    try {
      await updateBookPrice(id, Number(newPrice));
      alert("Price updated");
      fetchBooks();
    } catch (err) {
      alert("Failed to update price");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📚 Book Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Book Name"
          value={form.book_name}
          onChange={(e) =>
            setForm({ ...form, book_name: e.target.value })
          }
        />

        <input
          className={styles.input}
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          className={styles.input}
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />

        <button type="submit" className={styles.submitBtn}>
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* BOOK LIST */}
      <div className={styles.bookList}>
        {books.map((book) => (
          <div key={book.book_id} className={styles.card}>
            <h3 className={styles.title}>{book.book_name}</h3>
            <p className={styles.price}>₹{book.price}</p>
            <p className={styles.stock}>Stock: {book.stock}</p>

            <div className={styles.actions}>
              <button
                onClick={() => handleEdit(book)}
                className={`${styles.btn} ${styles.editBtn}`}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(book.book_id)}
                className={`${styles.btn} ${styles.deleteBtn}`}
              >
                Delete
              </button>

              <button
                onClick={() => handlePriceUpdate(book.book_id)}
                className={`${styles.btn} ${styles.priceBtn}`}
              >
                Price
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBooks;