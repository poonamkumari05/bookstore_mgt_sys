import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import styles from "./navbar.module.css";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");

  // ✅ FIXED SEARCH
  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/home");
      return;
    }

    navigate(`/home?q=${search}`); // ✅ key fix

    if (onSearch) {
      onSearch(search);
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/home")}>
        📚 BookStore
      </div>

      {user?.role === "consumer" && (
        <div className={styles.searchBox}>
          <input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}

      <div className={styles.navLinks}>
        {user?.role === "consumer" && (
          <>
            <button onClick={() => navigate("/home")}>Home</button>
            <button onClick={() => navigate("/cart")}>Cart</button>
            <button onClick={() => navigate("/orders")}>Orders</button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
            <button onClick={() => navigate("/admin/books")}>Books</button>
            <button onClick={() => navigate("/admin/authors")}>Authors</button>
            <button onClick={() => navigate("/admin/bookAuthorMapping")}>Book-Author Mapping</button>
            <button onClick={() => navigate("/admin/orders")}>Orders</button>
            <button onClick={() => navigate("/admin/payments")}>Payments</button>
          </>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;