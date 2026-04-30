import { useEffect, useState } from "react";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../services/authorApi";

import styles from "./authors.module.css";

function AdminAuthor() {
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ author_name: "", email: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const res = await getAuthors();
    setAuthors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateAuthor(editId, form);
    } else {
      await createAuthor(form);
    }

    setForm({ author_name: "", email: "" });
    setEditId(null);
    fetchAuthors();
  };

  const handleEdit = (a) => {
    setForm({ author_name: a.author_name, email: a.email });
    setEditId(a.author_id);
  };

  const handleDelete = async (id) => {
    await deleteAuthor(id);
    fetchAuthors();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👤 Author Management</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Author Name"
          value={form.author_name}
          onChange={(e) =>
            setForm({ ...form, author_name: e.target.value })
          }
          required
        />

        <input
          className={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <button className={styles.button}>
          {editId ? "Update" : "Add Author"}
        </button>
      </form>

      <div className={styles.list}>
        {authors.map((a) => (
          <div key={a.author_id} className={styles.card}>
            <h4 className={styles.name}>{a.author_name}</h4>
            <p className={styles.email}>{a.email}</p>

            <div className={styles.actions}>
              <button
                className={styles.editBtn}
                onClick={() => handleEdit(a)}
              >
                Edit
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(a.author_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAuthor;