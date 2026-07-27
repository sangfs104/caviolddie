// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// // Định nghĩa TypeScript Interfaces
// interface Variant {
//   _id?: string;
//   size?: string;
//   color?: string;
//   price: number;
//   discountPrice?: number;
//   image?: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   images?: string[];
// }

// interface CartItem {
//   _id: string;
//   quantity: number;
//   product: Product;
//   variant?: Variant;
// }

// const getUserId = () => {
//   if (typeof window !== "undefined") {
//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     if (user?.id) return user.id;
//     return localStorage.getItem("guestId") || "";
//   }
//   return "";
// };

// // Chuẩn hoá đường dẫn ảnh: nối domain backend nếu là path tương đối
// // ✅ Đồng bộ logic với ProductDetail.tsx: force https + thêm /api nếu thiếu
// // const getImageUrl = (imgPath?: string): string => {
// //   if (!imgPath) return "/img/placeholder.jpg";

// //   if (imgPath.startsWith("http")) {
// //     // Force https
// //     let url = imgPath.replace(/^http:\/\//, "https://");
// //     // Thêm /api nếu thiếu (đường dẫn ảnh backend dạng /api/products/images/...)
// //     url = url.replace(/(https:\/\/[^/]+)(\/products\/images\/)/, "$1/api$2");
// //     return url;
// //   }

// //   return `${process.env.NEXT_PUBLIC_API_URL}${
// //     imgPath.startsWith("/") ? "" : "/"
// //   }${imgPath}`;
// // };
// const getImageUrl = (imgPath?: string): string => {
//   if (!imgPath) return "/img/placeholder.jpg";
//   if (imgPath.startsWith("http")) {
//     return imgPath.replace(/^http:\/\//, "https://");
//   }
//   return `${process.env.NEXT_PUBLIC_API_URL}${
//     imgPath.startsWith("/") ? "" : "/"
//   }${imgPath}`;
// };
// const ShoppingCart = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [updating, setUpdating] = useState<string | null>(null);

//   const userId = getUserId();
//   const router = useRouter();

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const fetchCart = useCallback(async () => {
//     if (!userId) {
//       setCartItems([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
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
//       setError(null);
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
//       setCartItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   const updateQuantity = async (
//     itemId: string,
//     productId: string,
//     variantId: string | undefined,
//     newQuantity: number,
//   ) => {
//     if (newQuantity < 1) return;
//     setUpdating(itemId);

//     // Optimistic update
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === itemId ? { ...item, quantity: newQuantity } : item,
//       ),
//     );

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/update`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             userId,
//             productId,
//             variantId,
//             quantity: newQuantity,
//           }),
//         },
//       );

//       if (!res.ok) throw new Error("Không thể cập nhật số lượng");

//       const data = await res.json();
//       setCartItems(data.items || []);
//       window.dispatchEvent(new Event("cart-updated"));
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
//       // Rollback nếu cần
//       fetchCart();
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const removeItem = async (
//     itemId: string,
//     productId: string,
//     variantId: string | undefined,
//   ) => {
//     setUpdating(itemId);

//     const prevItems = cartItems;
//     // Optimistic update
//     setCartItems((prev) => prev.filter((item) => item._id !== itemId));

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             userId,
//             productId,
//             variantId,
//           }),
//         },
//       );

//       if (!res.ok) throw new Error("Không thể xóa sản phẩm");

//       const data = await res.json();
//       setCartItems(data.items || []);
//       window.dispatchEvent(new Event("cart-updated"));
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
//       // Rollback nếu xóa thất bại
//       setCartItems(prevItems);
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const getEffectivePrice = (item: CartItem) => {
//     const variant = item.variant;
//     return variant?.discountPrice && variant.discountPrice < variant.price
//       ? variant.discountPrice
//       : variant?.price || 0;
//   };

//   const subtotal = cartItems.reduce(
//     (total, item) => total + getEffectivePrice(item) * item.quantity,
//     0,
//   );

//   const handleCheckout = () => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     router.push("/checkout");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         <p className="text-gray-600 text-lg">Đang tải...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         <p className="text-red-600 text-lg">Lỗi: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6 md:py-8">
//         <div className="flex justify-between items-center mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold">Giỏ hàng của bạn</h1>
//           <Link
//             href="/products"
//             className="text-xs sm:text-sm underline hover:no-underline"
//           >
//             Tiếp tục mua sắm
//           </Link>
//         </div>

//         {cartItems.length === 0 ? (
//           <div className="text-center py-12 sm:py-16">
//             <p className="text-gray-600 text-base sm:text-lg">
//               Giỏ hàng của bạn đang trống
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Header Table */}
//             <div className="grid grid-cols-12 gap-4 pb-3 sm:pb-4 border-b border-gray-200 text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
//               <div className="col-span-6">SẢN PHẨM</div>
//               <div className="col-span-3 text-center">SỐ LƯỢNG</div>
//               <div className="col-span-3 text-right">TỔNG</div>
//             </div>

//             {/* Cart Items */}
//             <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
//               {cartItems.map((item) => {
//                 const effectivePrice = getEffectivePrice(item);
//                 const originalPrice = item.variant?.price || 0;
//                 const isOnSale =
//                   item.variant?.discountPrice &&
//                   item.variant.discountPrice < item.variant.price;

//                 return (
//                   <div
//                     key={item._id}
//                     className="grid grid-cols-12 gap-4 items-center"
//                   >
//                     <div className="col-span-6 flex items-center space-x-3 sm:space-x-4">
//                       <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         <Image
//                           src={getImageUrl(
//                             item.variant?.image || item.product?.images?.[0],
//                           )}
//                           alt={item.product?.name || "Sản phẩm"}
//                           width={80}
//                           height={80}
//                           unoptimized
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-medium text-xs sm:text-sm uppercase mb-1">
//                           {item.product?.name || "Không có tên"}
//                         </h3>
//                         <div className="text-gray-600 text-xs sm:text-sm">
//                           {isOnSale ? (
//                             <div className="flex items-center space-x-2">
//                               <span className="text-red-500">
//                                 {formatPrice(effectivePrice)}
//                               </span>
//                               <span className="line-through text-gray-400">
//                                 {formatPrice(originalPrice)}
//                               </span>
//                             </div>
//                           ) : (
//                             <span>{formatPrice(effectivePrice)}</span>
//                           )}
//                         </div>
//                         {item.variant && (
//                           <p className="text-gray-600 text-xs sm:text-sm">
//                             Kích thước: {item.variant.size}, Màu sắc:{" "}
//                             {item.variant.color}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="col-span-3 flex justify-center">
//                       <div className="flex items-center border border-gray-300 rounded-md">
//                         <button
//                           onClick={() =>
//                             updateQuantity(
//                               item._id,
//                               item.product._id,
//                               item.variant?._id,
//                               item.quantity - 1,
//                             )
//                           }
//                           className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
//                           disabled={
//                             item.quantity === 1 || updating === item._id
//                           }
//                         >
//                           <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
//                         </button>
//                         <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-gray-300 min-w-[50px] sm:min-w-[60px] text-center text-xs sm:text-sm">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() =>
//                             updateQuantity(
//                               item._id,
//                               item.product._id,
//                               item.variant?._id,
//                               item.quantity + 1,
//                             )
//                           }
//                           className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
//                           disabled={updating === item._id}
//                         >
//                           <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
//                         </button>
//                       </div>

//                       <button
//                         onClick={() =>
//                           removeItem(
//                             item._id,
//                             item.product._id,
//                             item.variant?._id,
//                           )
//                         }
//                         className="ml-2 sm:ml-3 p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
//                         disabled={updating === item._id}
//                       >
//                         <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                       </button>
//                     </div>

//                     <div className="col-span-3 text-right">
//                       <span className="font-medium text-base sm:text-lg">
//                         {formatPrice(effectivePrice * item.quantity)}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Summary */}
//             <div className="border-t border-gray-200 pt-4 sm:pt-6">
//               <div className="flex justify-end">
//                 <div className="w-full max-w-md space-y-3 sm:space-y-4">
//                   <div className="flex justify-between items-center text-base sm:text-lg">
//                     <span className="font-medium">Tổng ước tính</span>
//                     <span className="font-semibold">
//                       {formatPrice(subtotal)}
//                     </span>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Thuế, chiết khấu và{" "}
//                     <span className="underline">phí vận chuyển</span> được tính
//                     khi thanh toán
//                   </p>
//                   <button
//                     onClick={handleCheckout}
//                     className="w-full bg-black text-white py-3 sm:py-4 px-4 sm:px-6 rounded-md font-medium hover:bg-gray-800 transition-colors text-xs sm:text-sm block text-center"
//                   >
//                     Thanh toán
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShoppingCart;
"use client";

import { useState, useEffect, useCallback } from "react";
import { Minus, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Định nghĩa TypeScript Interfaces
interface Variant {
  _id?: string;
  size?: string;
  color?: string;
  price: number;
  discountPrice?: number;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  images?: string[];
}

interface CartItem {
  _id: string;
  quantity: number;
  product: Product;
  variant?: Variant;
}

const getUserId = () => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.id) return user.id;
    return localStorage.getItem("guestId") || "";
  }
  return "";
};

// Chuẩn hoá đường dẫn ảnh: nối domain backend nếu là path tương đối
const getImageUrl = (imgPath?: string): string => {
  if (!imgPath) return "/img/placeholder.jpg";
  if (imgPath.startsWith("http")) {
    return imgPath.replace(/^http:\/\//, "https://");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${
    imgPath.startsWith("/") ? "" : "/"
  }${imgPath}`;
};

// Ngưỡng giá trị đơn hàng tối thiểu để được thanh toán
const MIN_ORDER_VALUE = 400000;

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const userId = getUserId();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
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
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (
    itemId: string,
    productId: string,
    variantId: string | undefined,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);

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
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      // Rollback nếu cần
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (
    itemId: string,
    productId: string,
    variantId: string | undefined,
  ) => {
    setUpdating(itemId);

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
          body: JSON.stringify({
            userId,
            productId,
            variantId,
          }),
        },
      );

      if (!res.ok) throw new Error("Không thể xóa sản phẩm");

      const data = await res.json();
      setCartItems(data.items || []);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      // Rollback nếu xóa thất bại
      setCartItems(prevItems);
    } finally {
      setUpdating(null);
    }
  };

  const getEffectivePrice = (item: CartItem) => {
    const variant = item.variant;
    return variant?.discountPrice && variant.discountPrice < variant.price
      ? variant.discountPrice
      : variant?.price || 0;
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + getEffectivePrice(item) * item.quantity,
    0,
  );

  const canCheckout = subtotal >= MIN_ORDER_VALUE;

  const handleCheckout = () => {
    if (!canCheckout) return;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("orderNote", note);
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-600 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-red-600 text-lg">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-4 sm:py-6 md:py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Giỏ hàng của bạn đang trống
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 text-sm underline hover:no-underline"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* ==================== CỘT DANH SÁCH SẢN PHẨM ==================== */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-wrap justify-between items-center gap-2 pb-4 mb-4 sm:mb-6 border-b border-gray-200">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Giỏ hàng của bạn
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Bạn đang có{" "}
                    <span className="font-semibold text-black">
                      {cartItems.length}
                    </span>{" "}
                    sản phẩm trong giỏ hàng
                  </p>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  {cartItems.map((item) => {
                    const effectivePrice = getEffectivePrice(item);
                    const originalPrice = item.variant?.price || 0;
                    const isOnSale =
                      item.variant?.discountPrice &&
                      item.variant.discountPrice < item.variant.price;
                    const variantLabel = [
                      item.variant?.color,
                      item.variant?.size,
                    ]
                      .filter(Boolean)
                      .join(" / ");

                    return (
                      <div
                        key={item._id}
                        className="flex items-start gap-3 sm:gap-4"
                      >
                        {/* Ảnh + nút Xóa */}
                        <div className="relative flex-shrink-0">
                          <button
                            onClick={() =>
                              removeItem(
                                item._id,
                                item.product._id,
                                item.variant?._id,
                              )
                            }
                            disabled={updating === item._id}
                            className="absolute -top-2 -left-2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-400/90 text-white text-[9px] sm:text-[10px] font-medium hover:bg-red-500 transition-colors flex items-center justify-center disabled:opacity-50"
                            aria-label="Xóa sản phẩm"
                          >
                            Xóa
                          </button>
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={getImageUrl(
                                item.variant?.image ||
                                  item.product?.images?.[0],
                              )}
                              alt={item.product?.name || "Sản phẩm"}
                              width={80}
                              height={80}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Tên + biến thể + đơn giá */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2">
                            {item.product?.name || "Không có tên"}
                          </h3>
                          {item.variant && variantLabel && (
                            <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1 text-[11px] sm:text-xs text-gray-700 mb-1.5 sm:mb-2">
                              {variantLabel}
                              <ChevronDown className="w-3 h-3" />
                            </div>
                          )}
                          <div className="text-gray-500 text-[11px] sm:text-xs">
                            {isOnSale ? (
                              <span className="flex items-center gap-2">
                                <span className="text-red-500">
                                  {formatPrice(effectivePrice)}
                                </span>
                                <span className="line-through text-gray-400">
                                  {formatPrice(originalPrice)}
                                </span>
                              </span>
                            ) : (
                              <span>{formatPrice(effectivePrice)}</span>
                            )}
                          </div>
                        </div>

                        {/* Tổng tiền + số lượng */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                            {formatPrice(effectivePrice * item.quantity)}
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-full">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.product._id,
                                  item.variant?._id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-l-full disabled:opacity-40"
                              disabled={
                                item.quantity === 1 || updating === item._id
                              }
                            >
                              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <span className="px-2 sm:px-3 min-w-[24px] sm:min-w-[28px] text-center text-xs sm:text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.product._id,
                                  item.variant?._id,
                                  item.quantity + 1,
                                )
                              }
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-r-full disabled:opacity-40"
                              disabled={updating === item._id}
                            >
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ghi chú đơn hàng */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-semibold mb-3">
                  Ghi chú đơn hàng
                </h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú cho đơn hàng của bạn (không bắt buộc)..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-3 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* ==================== CỘT THÔNG TIN ĐƠN HÀNG ==================== */}
            <div className="space-y-4 sm:space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">
                  Thông tin đơn hàng
                </h2>
                <div className="flex justify-between items-center py-4 border-y border-gray-200 mb-4">
                  <span className="font-medium text-sm sm:text-base">
                    Tổng tiền:
                  </span>
                  <span className="text-red-600 font-bold text-lg sm:text-2xl">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-4">
                  • Phí vận chuyển sẽ được tính ở trang thanh toán.
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                  className="w-full bg-red-600 text-white py-3 sm:py-3.5 rounded-md font-semibold hover:bg-red-700 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  THANH TOÁN
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-5 text-xs sm:text-sm">
                <p className="font-semibold mb-1">Chính sách mua hàng:</p>
                <p className="text-gray-700">
                  Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị
                  tối thiểu{" "}
                  <span className="font-semibold">
                    {formatPrice(MIN_ORDER_VALUE)}
                  </span>{" "}
                  trở lên.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-5">
                <p className="font-semibold text-xs sm:text-sm">
                  Khuyến mãi dành cho bạn
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
