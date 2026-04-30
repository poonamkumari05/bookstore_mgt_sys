import { useEffect, useState } from "react";
import styles from "./payments.module.css";
import { getAllPayments } from "../../services/paymentApi";

function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await getAllPayments();
    setPayments(res.data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>💳 Payments</h2>

      <div className={styles.paymentList}>
        {payments.map((p) => (
          <div key={p.payment_id} className={styles.card}>
            <p className={styles.orderId}>Order: {p.order_id}</p>

            <p className={styles.amount}>₹{p.amount}</p>

            <p className={styles.status}>
              Status:{" "}
              <span className={styles[p.payment_status]}>
                {p.payment_status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPayments;