/**
 * ============================================
 * ✅ UI / FORMATTER HELPERS
 * Online Bookstore Management System
 * ============================================
 */

/**
 * ✅ Format Price in Indian Rupees
 * Example:
 * 1500 -> ₹1,500.00
 */
export const formatPrice = (price = 0) => {
  const num = Number(price);

  if (isNaN(num) || num < 0) {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * ✅ Capitalize First Letter
 * Example:
 * "pending" -> "Pending"
 */
export const capitalize = (text = "") => {
  if (!text.trim()) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * ✅ Format Status for Better UI
 * Example:
 * "out_for_delivery" -> "Out For Delivery"
 */
export const formatStatus = (status = "") => {
  if (!status.trim()) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * ✅ Get Status UI Details
 * Returns:
 * - label
 * - className
 * - color
 * - icon
 */
export const getStatusUI = (status = "") => {
  const normalized = status.toLowerCase().trim();

  const statusMap = {
    pending: {
      label: "Pending",
      icon: "⏳",
      className: "status_pending",
      color: "#f39c12",
    },

    confirmed: {
      label: "Confirmed",
      icon: "✅",
      className: "status_confirmed",
      color: "#3498db",
    },

    processing: {
      label: "Processing",
      icon: "⚙️",
      className: "status_processing",
      color: "#3498db",
    },

    shipped: {
      label: "Shipped",
      icon: "🚚",
      className: "status_shipped",
      color: "#9b59b6",
    },

    delivered: {
      label: "Delivered",
      icon: "🎉",
      className: "status_delivered",
      color: "#27ae60",
    },

    cancelled: {
      label: "Cancelled",
      icon: "❌",
      className: "status_cancelled",
      color: "#e74c3c",
    },
  };

  const current =
    statusMap[normalized] || {
      label: formatStatus(status),
      icon: "ℹ️",
      className: "status_default",
      color: "#95a5a6",
    };

  return {
    ...current,
    fullLabel: `${current.icon} ${current.label}`,
  };
};

/**
 * ✅ Truncate Long Text
 * Example:
 * truncateText("Hello World", 5)
 * -> "Hello..."
 */
export const truncateText = (text = "", limit = 50) => {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit)}...`;
};

/**
 * ✅ Format Date
 * Example:
 * 2026-05-08 -> 08 May 2026
 */
export const formatDate = (date) => {
  if (!date) return "Invalid Date";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * ✅ Generate User Initials
 * Example:
 * "Poonam Kumari" -> "PK"
 */
export const getInitials = (name = "") => {
  if (!name.trim()) return "";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};