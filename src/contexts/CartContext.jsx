import { createContext, useContext, useEffect, useState } from "react";
import { cartApi } from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children })=> {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCart(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // const addToCart = async (productId, quantity = 1) => {
  //   const res = await cartApi.addItem(productId, quantity);
  //   await fetchCart();
  //   return res;
  // };

  // const updateQuantity = async (productId, quantity) => {
  //   await cartApi.updateItem(productId, quantity);
  //   await fetchCart();
  // };

  // const removeItem = async (productId) => {
  //   await cartApi.removeItem(productId);
  //   await fetchCart();
  // };
const addToCart = async (productId, quantity = 1, size = null) => {
  const res = await cartApi.addItem(productId, quantity, size);
  await fetchCart();
  return res;
};

const updateQuantity = async (itemId, quantity) => {
  await cartApi.updateItem(itemId, quantity);
  await fetchCart();
};

const removeItem = async (itemId) => {
  await cartApi.removeItem(itemId);
  await fetchCart();
};
  const clearCart = async () => {
    await cartApi.clearCart();
    setCart(null);
  };

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const totalPrice =
    cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
    0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        totalPrice,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = ()=> {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
