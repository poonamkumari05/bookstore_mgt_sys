import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { useState } from "react";

// AUTH
import Login from "./pages/auth/loginPage";
import Register from "./pages/auth/registerPage";

// USER
import Home from "./pages/user/homePage";
import Cart from "./pages/user/cart";
import Checkout from "./pages/user/checkout";
import Payment from "./pages/user/paymentPage";
import Orders from "./pages/user/orderPage";

// ADMIN
import AdminDashboard from "./pages/admin/dashboard";
import AdminBooks from "./pages/admin/books";
import AdminAuthor from "./pages/admin/authors";
import BookAuthorMapping from "./pages/admin/bookAuthorMapping";
import AdminOrders from "./pages/admin/orders";
import AdminPayments from "./pages/admin/payments";

// COMPONENTS
import PrivateRoute from "./components/privateRoutes";
import Navbar from "./components/navbar";
import Chatbot from "./components/chatbot";

function App() {
  const { user } = useAuth();

  //  GLOBAL SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      {/*  NAVBAR: Now stays at the top. 
        OnSearch updates the state which is passed to the Home component.
      */}
      {user && <Navbar onSearch={setSearchQuery} />}

      {/* CONTENT WRAPPER: 
        The 'min-height' calculation (100vh - 70px) ensures that 
        even if a page is empty, the footer (if any) or background stays consistent.
      */}
      <main style={{ minHeight: "calc(100vh - 70px)", width: "100%" }}>
        <Routes>
          {/* DEFAULT REDIRECT LOGIC */}
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED USER ROUTES */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home searchQuery={searchQuery} />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />

          {/* PROTECTED ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/books"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminBooks />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/authors"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminAuthor />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/bookAuthorMapping"
            element={
              <PrivateRoute adminOnly={true}>
                <BookAuthorMapping />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPayments />
              </PrivateRoute>
            }
          />

          {/* 404 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {/*  CHATBOT: Always available at the bottom right */}
      {user && <Chatbot />}
    </BrowserRouter>
  );
}

export default App;