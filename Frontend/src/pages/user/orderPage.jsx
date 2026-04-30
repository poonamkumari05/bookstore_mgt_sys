import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderApi";
import { formatPrice } from "../../utils/helper";
import styles from "./orderPage.module.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Order Load Failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className={styles.loader}>Optimizing your order history...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📦 My Orders</h2>
      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className={styles.orderCard}>
            {/* TOP HEADER: Order ID and Status */}
            <div className={styles.orderHeader}>
              <span className={styles.orderId}>ORDER #{order.order_id}</span>
              <span className={`${styles.statusBadge} ${styles[`status_${order.status?.toLowerCase()}`]}`}>
                {order.status}
              </span>
            </div>

            <div className={styles.orderBody}>
              {/* ADDRESS SECTION */}
              <div className={styles.addressSection}>
                <h4 className={styles.sectionTitle}>Shipping Address</h4>
                <div className={styles.addressBox}>
                  {order.address ? (
                    <>
                      <p><strong>City:</strong> {order.address.city}</p>
                      <p><strong>State:</strong> {order.address.state}</p>
                      <p><strong>Pincode:</strong> {order.address.pincode}</p>
                    </>
                  ) : (
                    <p className={styles.errorText}>Address details unavailable</p>
                  )}
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className={styles.itemsSection}>
                <h4 className={styles.sectionTitle}>Order Items</h4>
                <div className={styles.itemsList}>
                  {order.order_items?.map((item) => (
                    <div key={item.order_item_id} className={styles.itemEntry}>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.book?.book_name}</span>
                        <span className={styles.itemQty}>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.itemPrice}>
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GRAND TOTAL */}
              <div className={styles.grandTotal}>
                <span>Amount Paid</span>
                <span className={styles.totalValue}>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;