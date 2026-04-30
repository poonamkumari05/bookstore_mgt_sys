import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../../services/paymentApi";
import { formatPrice } from "../../utils/helper";
import styles from "./paymentPage.module.css";

function Payment() {
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [orderData, setOrderData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.orderId) {
      setOrderData(location.state);
      localStorage.setItem("paymentData", JSON.stringify(location.state));
    } else {
      const saved = localStorage.getItem("paymentData");
      if (saved && saved !== "undefined") {
        setOrderData(JSON.parse(saved));
      }
    }
  }, [location.state]);

  const handlePayment = async () => {
    if (!orderData) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      await createPayment({
        order_id: orderData.orderId,
        amount: Number(orderData.amount),
        payment_method: method,
      });

      setStatus({
        type: "success",
        msg: "Your order has been placed successfully 🎉",
      });

      localStorage.removeItem("paymentData");

      setTimeout(() => {
        navigate("/orders");
      }, 3000);

    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Payment failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return <div className={styles.loader}>Loading payment...</div>;
  }

  if (status.type === "success") {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <h1>✅ Order Placed</h1>
          <p>{status.msg}</p>
          <p className={styles.redirectText}>Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h2>💳 Payment</h2>
          <p>Order ID: #{orderData.orderId}</p>
        </div>

        <div className={styles.orderInfo}>
          <span>Total Amount</span>
          <span className={styles.amount}>
            {formatPrice(Number(orderData.amount) || 0)}
          </span>
        </div>

        {status.msg && (
          <div className={`${styles.statusMsg} ${styles.error}`}>
            {status.msg}
          </div>
        )}

        <div className={styles.methodGroup}>
          {[
            { id: "cod", label: "Cash on Delivery", icon: "💵" },
            { id: "upi", label: "UPI / GPay / PhonePe", icon: "📱" },
            { id: "card", label: "Debit / Credit Card", icon: "💳" },
          ].map((item) => (
            <label
              key={item.id}
              className={`${styles.methodLabel} ${
                method === item.id ? styles.selectedMethod : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={item.id}
                checked={method === item.id}
                onChange={(e) => setMethod(e.target.value)}
              />
              <span>{item.icon} {item.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.payBtn}
        >
          {loading
            ? "Processing..."
            : `Pay ${formatPrice(Number(orderData.amount) || 0)}`
          }
        </button>

      </div>
    </div>
  );
}

export default Payment;