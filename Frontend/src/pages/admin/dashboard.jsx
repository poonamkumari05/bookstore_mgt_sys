import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { getDashboard } from "../../services/adminApi";

function AdminDashboard() {
  const [stats, setStats] = useState({
    books: 0,
    orders: 0,
    payments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();

      console.log("DASHBOARD RESPONSE:", res.data);

      // ✅ HANDLE BOTH STRUCTURES
      const data = res.data.data || res.data;

      setStats({
        books: data.totalBooks || 0,
        orders: data.totalOrders || 0,
        payments: data.totalRevenue || 0, // using revenue here
      });
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 className={styles.loading}>Loading dashboard...</h3>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🛠 Admin Dashboard</h2>
      <p className={styles.subheading}>Welcome Admin 👋</p>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h3>Total Books</h3>
          <p>{stats.books}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Payments</h3>
          <p>{stats.payments}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
