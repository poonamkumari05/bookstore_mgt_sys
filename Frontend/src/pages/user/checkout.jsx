import { useEffect, useState } from "react";
import { getCart } from "../../services/cartApi";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../services/addressApi";
import { checkout } from "../../services/orderApi";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helper";
import styles from "./checkout.module.css";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddr, setNewAddr] = useState({ city: "", state: "", pincode: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data.cart_items || []);
    } catch (err) {
      console.error("Cart Fetch Failed", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      const data = res.data || [];
      setAddresses(data);
      if (data.length > 0) setSelectedAddress(data[0].address_id);
    } catch (err) {
      console.error("Address Fetch Failed", err);
    }
  };

  const handleEditClick = (e, addr) => {
    e.stopPropagation();
    setEditingId(addr.address_id);
    setNewAddr({ city: addr.city, state: addr.state, pincode: addr.pincode });
    setShowAddForm(true);
  };

  const handleDeleteAddress = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this address?")) return;

    try {
      setLoading(true);
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.address_id !== id));
      if (selectedAddress === id) setSelectedAddress("");
    } catch {
      setError("Failed to delete address.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        const res = await updateAddress(editingId, newAddr);
        setAddresses((prev) =>
          prev.map((a) => (a.address_id === editingId ? res.data.address : a)),
        );
      } else {
        const res = await createAddress(newAddr);
        setAddresses((prev) => [...prev, res.data.address]);
        setSelectedAddress(res.data.address.address_id);
      }

      resetForm();
    } catch {
      setError("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError("Please select address");
      return;
    }

    try {
      setLoading(true);

      const res = await checkout({ address_id: Number(selectedAddress) });

      console.log("CHECKOUT RESPONSE:", res.data); // ✅ DEBUG

      // ✅ SAFE AMOUNT FALLBACK (IMPORTANT FIX)
      const amount =
        Number(res.data?.total_amount) ||
        Number(res.data?.total) ||
        Number(res.data?.order?.total_amount) ||
        subtotal; // 👈 fallback from frontend

      navigate("/payment", {
        state: {
          orderId: res.data.order.order_id,
          amount: amount,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewAddr({ city: "", state: "", pincode: "" });
    setShowAddForm(false);
    setEditingId(null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.book.price) * item.quantity,
    0,
  );

  return (
    <div className={styles.checkoutContainer}>
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>📦 Secure Checkout</h2>

        {error && <div className={styles.errorMsg}>{error}</div>}

        {/* ADDRESS */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Shipping Address</h3>
            {!showAddForm && (
              <button
                className={styles.addBtn}
                onClick={() => setShowAddForm(true)}
              >
                + Add
              </button>
            )}
          </div>

          {showAddForm ? (
            <form
              onSubmit={handleSaveAddress}
              className={styles.newAddressForm}
            >
              <div className={styles.formGroup}>
                <input
                  className={styles.inputField}
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, city: e.target.value })
                  }
                  required
                />
                <input
                  className={styles.inputField}
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, state: e.target.value })
                  }
                  required
                />
              </div>

              <input
                className={styles.inputField}
                placeholder="Pincode"
                value={newAddr.pincode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, pincode: e.target.value })
                }
                required
              />

              <div className={styles.formActions}>
                <button className={styles.saveAddrBtn}>
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.addressGrid}>
              {addresses.map((addr) => (
                <div
                  key={addr.address_id}
                  className={`${styles.addressCard} ${
                    selectedAddress === addr.address_id
                      ? styles.selectedCard
                      : ""
                  }`}
                  onClick={() => setSelectedAddress(addr.address_id)}
                >
                  <div className={styles.addressInfo}>
                    <strong>{addr.city}</strong>
                    <p>
                      {addr.state} - {addr.pincode}
                    </p>
                  </div>

                  <div className={styles.addressActions}>
                    <button onClick={(e) => handleEditClick(e, addr)}>
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteAddress(e, addr.address_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ITEMS */}
        <section className={styles.card}>
          <h3>Review Items</h3>

          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className={styles.reviewItem}>
                {/* LEFT SIDE */}
                <div className={styles.itemMeta}>
                  <span className={styles.itemName}>{item.book.book_name}</span>

                  {/* ✅ QUANTITY ADDED */}
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                </div>

                {/* RIGHT SIDE */}
                <div className={styles.itemPrice}>
                  {formatPrice(item.book.price)} × {item.quantity}
                  <br />
                  <strong>
                    {formatPrice(item.book.price * item.quantity)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* SUMMARY */}
      <aside className={styles.sidebar}>
        <div className={styles.summaryCard}>
          <h3>Summary</h3>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.freeText}>FREE</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={loading || !selectedAddress}
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Checkout;
