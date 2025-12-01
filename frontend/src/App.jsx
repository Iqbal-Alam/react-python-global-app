import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import AddMedicine from "./pages/AddMedicine";
import InvoicePage from "./pages/InvoicePage";
import { CartProvider } from "./context/CartContext";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
        <CartProvider>
            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/add-medicine" element={isAuthenticated ? <AddMedicine /> : <Navigate to="/login" />} />
                <Route path="/leads" element={isAuthenticated ? <Leads /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/invoice" element={isAuthenticated ? <InvoicePage /> : <Navigate to="/login" />} />
            </Routes>
        </CartProvider>
    </BrowserRouter>
  );
}
