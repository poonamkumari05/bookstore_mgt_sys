import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ added
import { getBooks, searchBooks } from "../../services/bookApi";
import { addToCart } from "../../services/cartApi";
import { formatPrice } from "../../utils/helper";
import styles from "./homePage.module.css";

function Home({ searchQuery }) {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ added

  // ✅ get query from URL
  const queryParams = new URLSearchParams(location.search);
  const urlSearch = queryParams.get("q");

  useEffect(() => {
    if (urlSearch) {
      handleSearch(urlSearch);
    } else if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchBooks();
    }
  }, [searchQuery, urlSearch]); // ✅ updated

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (query) => {
    try {
      const res = await searchBooks(query);
      setBooks(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (book_id) => {
    try {
      await addToCart({
        book_id: Number(book_id),
        quantity: 1,
      });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✅ BUY NOW
  const handleBuyNow = async (book) => {
    try {
      await addToCart({
        book_id: Number(book.book_id),
        quantity: 1,
      });

      navigate("/checkout");
    } catch (err) {
      console.log(err);
      alert("Unable to process Buy Now");
    }
  };

  return (
    <div className={styles.homeContainer}>
      {books.length === 0 ? (
        <p className={styles.empty}>No books found</p>
      ) : (
        books.map((book) => (
          <div key={book.book_id} className={styles.card}>
            
            <img
              src="https://via.placeholder.com/150x200?text=Book"
              alt="book"
              className={styles.bookImage}
            />

            <h3>{book.book_name}</h3>
            <p className={styles.price}>{formatPrice(book.price)}</p>
            <p className={styles.stock}>Stock: {book.stock}</p>

            <button
              onClick={() => handleAddToCart(book.book_id)}
              disabled={book.stock === 0}
              className={styles.cartBtn}
            >
              {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={() => handleBuyNow(book)}
              disabled={book.stock === 0}
              className={styles.buyBtn}
            >
              Buy Now
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;