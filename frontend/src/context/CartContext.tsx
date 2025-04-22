import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCartItems, addCartItem, updateCartItem, deleteCartItem, fetchCart } from '../api/Cart';
import { CartItem, FullCartItem } from '../types/cart';
import { useAuth } from './AuthContext';
import { ReactNode } from 'react';

interface CartContextProps {
  cartItems: FullCartItem[];
  cartId: string | null;
  addItem: (item: Partial<CartItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { accessToken } = useAuth();
  const [cartItems, setCartItems] = useState<FullCartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the user's cart and cart items
  useEffect(() => {
    const loadCart = async () => {
      console.log("Loading cart with accessToken:", accessToken);
      if (!accessToken) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // First get the cart ID
        const cart = await fetchCart(accessToken);
        console.log("Cart fetched:", cart);
        setCartId(cart.id);
        // Then get the items in the cart
        const items = await fetchCartItems(accessToken);
        setCartItems(items);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [accessToken]);

  // Add item to cart (only need product_id and quantity, we'll add the cart_id)
  const addItem = async (item: Partial<CartItem>) => {
    console.log("cartID:", cartId);
    if (!accessToken ) return;
    var c_id = cartId;
    if (c_id === null || c_id === undefined || c_id === '') {
      console.log("Cart ID is null, fetching cart...");
      var c = await fetchCart(accessToken);
      console.log("Cart ID from addItem:", c.id);
      c_id = c.id;
      setCartId(c.id);
    } 
    console.log("Cart ID:", c_id);
    // Check if the item is already in the cart
    const existingItem = cartItems.find(cartItem => cartItem.listing.id === item.product_id);
    if (existingItem) {
      throw new Error('Not enough inventory available');
    }
    try {
      // If not already in cart, proceed with adding new item
      const itemToAdd = {
        product_id: item.product_id!,
        quantity: item.quantity || 1,
        cart: c_id,
      };

      // This now returns a FullCartItem with product details
      const newItem = await addCartItem(itemToAdd, accessToken);
      setCartItems((prev) => [...prev, newItem]);
  
      console.log("Item added to cart:", newItem);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error; // Re-throw to allow component to handle it
    }
  };

  const removeItem = async (id: string) => {
    if (!accessToken) return;
    await deleteCartItem(id, accessToken);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartId,
      addItem, 
      removeItem, 
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
