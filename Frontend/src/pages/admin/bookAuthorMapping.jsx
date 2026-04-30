import { useState, useEffect } from "react";
import { getBooks } from "../../services/bookApi";
import { getAuthors, assignAuthorToBook } from "../../services/authorApi";

import styles from "./bookAuthorMapping.module.css";

function Mapping() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selected, setSelected] = useState({
    book_id: "",
    author_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const bookRes = await getBooks();
    const authorRes = await getAuthors();

    setBooks(bookRes.data);
    setAuthors(authorRes.data);
  };

  const handleAssign = async () => {
    if (!selected.book_id || !selected.author_id) {
      alert("Please select both book and author");
      return;
    }

    await assignAuthorToBook(selected);
    alert("Mapped successfully");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📚 Book–Author Mapping</h2>

      <div className={styles.formGroup}>
        <select
          className={styles.select}
          onChange={(e) =>
            setSelected({
              ...selected,
              book_id: Number(e.target.value),
            })
          }
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.book_id} value={b.book_id}>
              {b.book_name}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          onChange={(e) =>
            setSelected({
              ...selected,
              author_id: Number(e.target.value),
            })
          }
        >
          <option value="">Select Author</option>
          {authors.map((a) => (
            <option key={a.author_id} value={a.author_id}>
              {a.author_name}
            </option>
          ))}
        </select>

        <button
          className={styles.button}
          onClick={handleAssign}
          disabled={!selected.book_id || !selected.author_id}
        >
          Assign Author
        </button>
      </div>
    </div>
  );
}

export default Mapping;