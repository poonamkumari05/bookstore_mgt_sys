import { useEffect, useState, useRef } from "react";
import { getCart, updateCart, removeFromCart } from "../../services/cartApi";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helper";
import styles from "./cart.module.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  
  // Ref to prevent the debouncer from running on the first mount
  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data.cart_items || []);
    } catch (err) {
      console.error("Cart Fetch Error:", err);
    }
  };

  // Professional Update Logic: Local State Sync + API Call
  const updateLocalQty = (itemId, newQty) => {
    if (newQty < 1) return;

    // 1. Update UI immediately (Optimistic UI)
    setCartItems((prev) =>
      prev.map((item) =>
        item.cart_item_id === itemId ? { ...item, quantity: newQty } : item
      )
    );

    // 2. Trigger API update
    // In a real pro app, you'd debounce this. 
    // Here is the direct call for simplicity, but triggered via buttons:
    performApiUpdate(itemId, newQty);
  };

  const performApiUpdate = async (id, quantity) => {
    try {
      await updateCart(id, quantity);
      // We don't fetchCart() here to avoid a "flicker" 
      // because our local state is already updated!
    } catch (err) {
      console.error("Sync failed:", err);
      fetchCart(); // Revert to server state if API fails
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCartItems(cartItems.filter(item => item.cart_item_id !== id));
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.book.price) * item.quantity,
    0
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🛒 Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className={styles.emptyMsg}>
          <p>Your cart feels light. Let's add some books!</p>
          <button className={styles.checkoutBtn} onClick={() => navigate("/")}>
            Browse Shop
          </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className={styles.cartItem}>
              <div className={styles.itemDetails}>
                <h3>{item.book.book_name}</h3>
                <p className={styles.price}>{formatPrice(item.book.price * item.quantity)}</p>
              </div>

              <div className={styles.actions}>
                {/* PRO QUANTITY TOGGLE */}
                <div className={styles.qtyWrapper}>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => updateLocalQty(item.cart_item_id, item.quantity - 1)}
                  >
                    −
                  </button>
                  
                  <div className={styles.qtyDisplay}>{item.quantity}</div>
                  
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => updateLocalQty(item.cart_item_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button 
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.cart_item_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className={styles.summary}>
            <div>
              <p style={{ margin: 0, color: "#666" }}>Subtotal</p>
              <h3 className={styles.totalAmount}>{formatPrice(total)}</h3>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              Checkout Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;