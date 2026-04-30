import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ not admin but trying admin route
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  // ✅ allowed
  return children;
}

export default PrivateRoute;