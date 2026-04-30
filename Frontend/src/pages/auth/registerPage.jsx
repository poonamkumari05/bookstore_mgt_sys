import { useState } from "react";
import { registerUser } from "../../services/authApi";
import { useNavigate, Link } from "react-router-dom";
import styles from "./register.module.css"; // Import the CSS Module

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error during registration");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.logo}>📚 Book Store</h2>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            placeholder="Full Name"
            type="text"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className={styles.input}
            placeholder="Email Address"
            type="email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          
          <input
            className={styles.input}
            type="text"
            placeholder="Role"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;