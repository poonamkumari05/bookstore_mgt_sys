import { useState } from "react";
import { loginUser } from "../../services/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import styles from "./login.module.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("consumer");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ decode JWT to get role
  const getUserFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id,
        role: payload.role,
      };
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🚫 prevent double click

    try {
      setLoading(true);

      const res = await loginUser(form);

      // console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;

      // ✅ extract user from token
      const userData = getUserFromToken(token);

      if (!userData) {
        return alert("Invalid token received");
      }

      // ✅ OPTIONAL: check selected role
      if (userData.role !== selectedRole) {
        return alert(`Please select ${userData.role} login`);
      }

      // ✅ save in context
      login(userData, token);

      //alert("Login Success");

      // ✅ redirect
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.logo}>📚 Book Store</h2>

      <div className={styles.formBox}>
        <h2>Login</h2>

        {/* ROLE SWITCH */}
        <div className={styles.roleSwitch}>
          <button
            type="button"
            className={
              selectedRole === "consumer"
                ? styles.activeRole
                : styles.roleBtn
            }
            onClick={() => setSelectedRole("consumer")}
          >
            👤 Consumer
          </button>

          <button
            type="button"
            className={
              selectedRole === "admin"
                ? styles.activeRole
                : styles.roleBtn
            }
            onClick={() => setSelectedRole("admin")}
          >
            🛠️ Admin
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className={styles.button} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {selectedRole === "consumer" && (
          <p className={styles.registerText}>
            Don't have an account?{" "}
            <Link className={styles.link} to="/register">
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;