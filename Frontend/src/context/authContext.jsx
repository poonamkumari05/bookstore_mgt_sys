import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ important

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // ✅ restore user only if BOTH exist
      if (
        storedUser &&
        storedUser !== "undefined" &&
        token
      ) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.log("Invalid user in localStorage");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");   // ❗ better than clear()
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* ✅ prevent early redirect */}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = () => useContext(AuthContext);