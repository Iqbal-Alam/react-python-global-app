import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Check if user is logged in (you may store token in localStorage)
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return; // ✅ skip fetching cart if not logged in

    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCartItems(res.data.data || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [token]); // only runs if token exists

  const addToCart = async (item) => {
    if (!token) return; // safety check
    console.log('=== add to cart request===', item);
    try {
      const res = await api.post("/cart", item);
      setCartItems((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateCartItem = async (id, updatedItem) => {
    if (!token) return;
    try {
      const res = await api.put(`/cart/${id}`, updatedItem);
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? res.data.data : item))
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const removeFromCart = async (id) => {
    if (!token) return;
    try {
      await api.delete(`/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await api.delete("/cart");
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
