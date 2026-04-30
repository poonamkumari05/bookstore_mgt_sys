/**
 * ✅ Format price with Indian Rupee Symbol and Commas
 * Handles strings, numbers, and null values safely.
 * Example: 1500.5 -> ₹1,500.50
 */
export const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num === 0) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * ✅ Capitalize first letter
 * Example: "pending" -> "Pending"
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * ✅ Format order status nicely for UI
 * Handles underscores and cases.
 * Example: "out_for_delivery" -> "Out For Delivery"
 */
export const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .split(/[_\s]+/) // handles both underscores and spaces
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * ✅ Status with Icon and Theme-ready Strings
 * Use this in your Order cards for professional visual feedback.
 */
export const getStatusUI = (status) => {
  const s = status?.toLowerCase() || "";
  const label = formatStatus(status);

  switch (s) {
    case "pending":
      return { label: `⏳ ${label}`, class: "status_pending", color: "#f39c12" };
    case "confirmed":
    case "processing":
      return { label: `⚙️ ${label}`, class: "status_processing", color: "#3498db" };
    case "shipped":
      return { label: `🚚 ${label}`, class: "status_shipped", color: "#9b59b6" };
    case "delivered":
      return { label: `✅ ${label}`, class: "status_delivered", color: "#27ae60" };
    case "cancelled":
      return { label: `❌ ${label}`, class: "status_cancelled", color: "#e74c3c" };
    default:
      return { label: label, class: "status_default", color: "#95a5a6" };
  }
};