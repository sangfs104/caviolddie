// "use client";

// import { createContext, useContext, useState, useEffect } from "react";

// interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     images: string[];
//     // Thêm các chi tiết sản phẩm khác nếu cần
//   };
//   variant?: {
//     _id: string;
//     size: string;
//     color: string;
//     price: number;
//     image: string;
//     // Thêm chi tiết biến thể khác
//   };
//   quantity: number;
//   // Thêm các trường khác nếu cần
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
//   fetchCart: () => Promise<void>;
//   // Thêm các hàm khác như updateQuantity, removeItem nếu cần di chuyển vào context
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const getUserId = () => {
//     if (typeof window !== "undefined") {
//       const user = JSON.parse(localStorage.getItem("user") || "null");
//       if (user?.id) return user.id;
//       return localStorage.getItem("guestId") || "";
//     }
//     return "";
//   };

//   const userId = getUserId();

//   const fetchCart = async () => {
//     if (!userId) {
//       setCartItems([]);
//       return;
//     }
//     try {
//       const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Không thể tải giỏ hàng");
//       const data = await res.json();
//       setCartItems(data.items || []);
//     } catch (err) {
//       console.error(err);
//       setCartItems([]);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [userId]);

//   return (
//     <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  variant?: {
    _id: string;
    size: string;
    color: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<void>;
  // Có thể thêm sau: addToCart, removeFromCart, updateQuantity...
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getUserId = useCallback((): string => {
    if (typeof window === "undefined") return "";

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.id) return user.id;

    return localStorage.getItem("guestId") || "";
  }, []);

  const userId = getUserId();

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Không thể tải giỏ hàng");

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCartItems([]);
    }
  }, [userId]);

  // Fetch cart khi userId thay đổi
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
