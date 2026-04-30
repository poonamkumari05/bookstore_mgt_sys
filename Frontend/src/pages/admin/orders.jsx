import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import { getAllOrders, updateOrderStatus } from "../../services/orderApi";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.data);
  };

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📦 Orders</h2>

      <div className={styles.orderList}>
        {orders.map((o) => (
          <div key={o.order_id} className={styles.card}>
            <p className={styles.orderId}>Order #{o.order_id}</p>

            <p className={styles.status}>
              Status:{" "}
              <span className={styles[o.status]}>
                {o.status}
              </span>
            </p>

            <select
              className={styles.select}
              value={o.status}
              onChange={(e) => handleStatus(o.order_id, e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;