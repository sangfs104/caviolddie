// // "use client";

// // import { createContext, useContext, useState, useEffect } from "react";

// // interface CartItem {
// //   _id: string;
// //   product: {
// //     _id: string;
// //     name: string;
// //     price: number;
// //     images: string[];
// //     // Thêm các chi tiết sản phẩm khác nếu cần
// //   };
// //   variant?: {
// //     _id: string;
// //     size: string;
// //     color: string;
// //     price: number;
// //     image: string;
// //     // Thêm chi tiết biến thể khác
// //   };
// //   quantity: number;
// //   // Thêm các trường khác nếu cần
// // }

// // interface CartContextType {
// //   cartItems: CartItem[];
// //   setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
// //   fetchCart: () => Promise<void>;
// //   // Thêm các hàm khác như updateQuantity, removeItem nếu cần di chuyển vào context
// // }

// // const CartContext = createContext<CartContextType | undefined>(undefined);

// // export const CartProvider = ({ children }: { children: React.ReactNode }) => {
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// //   const getUserId = () => {
// //     if (typeof window !== "undefined") {
// //       const user = JSON.parse(localStorage.getItem("user") || "null");
// //       if (user?.id) return user.id;
// //       return localStorage.getItem("guestId") || "";
// //     }
// //     return "";
// //   };

// //   const userId = getUserId();

// //   const fetchCart = async () => {
// //     if (!userId) {
// //       setCartItems([]);
// //       return;
// //     }
// //     try {
// //       const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
// //         credentials: "include",
// //       });
// //       if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// //       const data = await res.json();
// //       setCartItems(data.items || []);
// //     } catch (err) {
// //       console.error(err);
// //       setCartItems([]);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCart();
// //   }, [userId]);

// //   return (
// //     <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => {
// //   const context = useContext(CartContext);
// //   if (!context) {
// //     throw new Error("useCart must be used within a CartProvider");
// //   }
// //   return context;
// // };
// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";

// interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     images: string[];
//   };
//   variant?: {
//     _id: string;
//     size: string;
//     color: string;
//     price: number;
//     image: string;
//   };
//   quantity: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
//   fetchCart: () => Promise<void>;
//   // Có thể thêm sau: addToCart, removeFromCart, updateQuantity...
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const getUserId = useCallback((): string => {
//     if (typeof window === "undefined") return "";

//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     if (user?.id) return user.id;

//     return localStorage.getItem("guestId") || "";
//   }, []);

//   const userId = getUserId();

//   const fetchCart = useCallback(async () => {
//     if (!userId) {
//       setCartItems([]);
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
//         {
//           credentials: "include",
//         },
//       );

//       if (!res.ok) throw new Error("Không thể tải giỏ hàng");

//       const data = await res.json();
//       setCartItems(data.items || []);
//     } catch (err) {
//       console.error("Fetch cart error:", err);
//       setCartItems([]);
//     }
//   }, [userId]);

//   // Fetch cart khi userId thay đổi
//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

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
  ReactNode,
} from "react";
import { useDispatch } from "react-redux";
import {
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from "@/redux/cartSlice";

// ==================== TYPES ====================

export interface Variant {
  _id?: string;
  size?: string;
  color?: string;
  price: number;
  discountPrice?: number;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  images?: string[];
}

export interface CartItem {
  _id: string;
  quantity: number;
  product: Product;
  variant?: Variant;
}

interface CartContextValue {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  updatingId: string | null;
  subtotal: number;
  refetchCart: () => Promise<void>;
  updateQuantity: (
    itemId: string,
    productId: string,
    variantId: string | undefined,
    newQuantity: number,
  ) => Promise<void>;
  removeItem: (
    itemId: string,
    productId: string,
    variantId: string | undefined,
  ) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ==================== HELPERS ====================

export const getUserId = (): string => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.id) return user.id;
    return localStorage.getItem("guestId") || "";
  }
  return "";
};

export const getImageUrl = (imgPath?: string): string => {
  if (!imgPath) return "/img/placeholder.jpg";
  if (imgPath.startsWith("http")) {
    return imgPath.replace(/^http:\/\//, "https://");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${
    imgPath.startsWith("/") ? "" : "/"
  }${imgPath}`;
};

export const getEffectivePrice = (item: CartItem): number => {
  const variant = item.variant;
  return variant?.discountPrice && variant.discountPrice < variant.price
    ? variant.discountPrice
    : variant?.price || 0;
};

// ==================== PROVIDER ====================
//
// Đây là nguồn dữ liệu (source of truth) DUY NHẤT cho giỏ hàng.
// ShoppingCart, CartDrawer, và trang Checkout đều phải lấy dữ liệu
// từ đây (qua hook useCart()) thay vì tự fetch/tự lưu localStorage riêng.
// => Xóa/sửa ở bất kỳ đâu cũng phản ánh ngay lập tức ở mọi nơi khác,
//    kể cả khi người dùng bấm "Thanh toán" ngay sau khi vừa xóa.

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const dispatch = useDispatch();

  const fetchCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Không thể tải giỏ hàng");

      const data = await res.json();
      setCartItems(data.items || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Vẫn giữ event "cart-updated" để tương thích với các nơi khác
  // (ví dụ nút "Thêm vào giỏ" ở trang chi tiết sản phẩm) đang dispatch
  // event này để báo Header/Badge số lượng cập nhật lại.
  useEffect(() => {
    const handler = () => fetchCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [fetchCart]);

  const updateQuantity = useCallback(
    async (
      itemId: string,
      productId: string,
      variantId: string | undefined,
      newQuantity: number,
    ) => {
      if (newQuantity < 1) return;
      const userId = getUserId();
      setUpdatingId(itemId);

      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/update`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              userId,
              productId,
              variantId,
              quantity: newQuantity,
            }),
          },
        );

        if (!res.ok) throw new Error("Không thể cập nhật số lượng");

        const data = await res.json();
        setCartItems(data.items || []);
        dispatch(
          updateQuantityAction({ productId, variantId, quantity: newQuantity }),
        );
        window.dispatchEvent(new Event("cart-updated"));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        // Rollback bằng cách lấy lại dữ liệu thật từ server
        await fetchCart();
      } finally {
        setUpdatingId(null);
      }
    },
    [dispatch, fetchCart],
  );

  const removeItem = useCallback(
    async (
      itemId: string,
      productId: string,
      variantId: string | undefined,
    ) => {
      const userId = getUserId();
      setUpdatingId(itemId);

      const prevItems = cartItems;
      // Optimistic update
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId, productId, variantId }),
          },
        );

        if (!res.ok) throw new Error("Không thể xóa sản phẩm");

        const data = await res.json();
        setCartItems(data.items || []);
        dispatch(removeFromCartAction({ productId, variantId }));
        if ((data.items || []).length === 0) {
          dispatch(clearCartAction());
        }
        window.dispatchEvent(new Event("cart-updated"));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        // Rollback nếu xóa thất bại
        setCartItems(prevItems);
      } finally {
        setUpdatingId(null);
      }
    },
    [cartItems, dispatch],
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + getEffectivePrice(item) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        updatingId,
        subtotal,
        refetchCart: fetchCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart phải được dùng bên trong <CartProvider>");
  }
  return ctx;
};
