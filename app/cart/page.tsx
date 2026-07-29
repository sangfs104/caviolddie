// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Minus, Plus, ChevronDown } from "lucide-react";
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
//   const [note, setNote] = useState("");

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
//     localStorage.setItem("orderNote", note);
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
//       <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-4 sm:py-6 md:py-8">
//         {cartItems.length === 0 ? (
//           <div className="text-center py-12 sm:py-16">
//             <h1 className="text-2xl sm:text-3xl font-bold mb-4">
//               Giỏ hàng của bạn
//             </h1>
//             <p className="text-gray-600 text-base sm:text-lg">
//               Giỏ hàng của bạn đang trống
//             </p>
//             <Link
//               href="/products"
//               className="inline-block mt-4 text-sm underline hover:no-underline"
//             >
//               Tiếp tục mua sắm
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//             {/* ==================== CỘT DANH SÁCH SẢN PHẨM ==================== */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
//                 <div className="flex flex-wrap justify-between items-center gap-2 pb-4 mb-4 sm:mb-6 border-b border-gray-200">
//                   <h1 className="text-xl sm:text-2xl font-bold">
//                     Giỏ hàng của bạn
//                   </h1>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Bạn đang có{" "}
//                     <span className="font-semibold text-black">
//                       {cartItems.length}
//                     </span>{" "}
//                     sản phẩm trong giỏ hàng
//                   </p>
//                 </div>

//                 <div className="space-y-5 sm:space-y-6">
//                   {cartItems.map((item) => {
//                     const effectivePrice = getEffectivePrice(item);
//                     const originalPrice = item.variant?.price || 0;
//                     const isOnSale =
//                       item.variant?.discountPrice &&
//                       item.variant.discountPrice < item.variant.price;
//                     const variantLabel = [
//                       item.variant?.color,
//                       item.variant?.size,
//                     ]
//                       .filter(Boolean)
//                       .join(" / ");

//                     return (
//                       <div
//                         key={item._id}
//                         className="flex items-start gap-3 sm:gap-4"
//                       >
//                         {/* Ảnh + nút Xóa */}
//                         <div className="relative flex-shrink-0">
//                           <button
//                             onClick={() =>
//                               removeItem(
//                                 item._id,
//                                 item.product._id,
//                                 item.variant?._id,
//                               )
//                             }
//                             disabled={updating === item._id}
//                             className="absolute -top-2 -left-2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-400/90 text-white text-[9px] sm:text-[10px] font-medium hover:bg-red-500 transition-colors flex items-center justify-center disabled:opacity-50"
//                             aria-label="Xóa sản phẩm"
//                           >
//                             Xóa
//                           </button>
//                           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
//                             <Image
//                               src={getImageUrl(
//                                 item.variant?.image ||
//                                   item.product?.images?.[0],
//                               )}
//                               alt={item.product?.name || "Sản phẩm"}
//                               width={80}
//                               height={80}
//                               unoptimized
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                         </div>

//                         {/* Tên + biến thể + đơn giá */}
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2">
//                             {item.product?.name || "Không có tên"}
//                           </h3>
//                           {item.variant && variantLabel && (
//                             <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1 text-[11px] sm:text-xs text-gray-700 mb-1.5 sm:mb-2">
//                               {variantLabel}
//                               <ChevronDown className="w-3 h-3" />
//                             </div>
//                           )}
//                           <div className="text-gray-500 text-[11px] sm:text-xs">
//                             {isOnSale ? (
//                               <span className="flex items-center gap-2">
//                                 <span className="text-red-500">
//                                   {formatPrice(effectivePrice)}
//                                 </span>
//                                 <span className="line-through text-gray-400">
//                                   {formatPrice(originalPrice)}
//                                 </span>
//                               </span>
//                             ) : (
//                               <span>{formatPrice(effectivePrice)}</span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Tổng tiền + số lượng */}
//                         <div className="flex flex-col items-end gap-2 flex-shrink-0">
//                           <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
//                             {formatPrice(effectivePrice * item.quantity)}
//                           </span>
//                           <div className="flex items-center border border-gray-300 rounded-full">
//                             <button
//                               onClick={() =>
//                                 updateQuantity(
//                                   item._id,
//                                   item.product._id,
//                                   item.variant?._id,
//                                   item.quantity - 1,
//                                 )
//                               }
//                               className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-l-full disabled:opacity-40"
//                               disabled={
//                                 item.quantity === 1 || updating === item._id
//                               }
//                             >
//                               <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                             </button>
//                             <span className="px-2 sm:px-3 min-w-[24px] sm:min-w-[28px] text-center text-xs sm:text-sm">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() =>
//                                 updateQuantity(
//                                   item._id,
//                                   item.product._id,
//                                   item.variant?._id,
//                                   item.quantity + 1,
//                                 )
//                               }
//                               className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-r-full disabled:opacity-40"
//                               disabled={updating === item._id}
//                             >
//                               <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Ghi chú đơn hàng */}
//               <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
//                 <h2 className="text-sm sm:text-base font-semibold mb-3">
//                   Ghi chú đơn hàng
//                 </h2>
//                 <textarea
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Ghi chú cho đơn hàng của bạn (không bắt buộc)..."
//                   rows={4}
//                   className="w-full border border-gray-300 rounded-md p-3 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>
//             </div>

//             {/* ==================== CỘT THÔNG TIN ĐƠN HÀNG ==================== */}
//             <div className="space-y-4 sm:space-y-6">
//               <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
//                 <h2 className="text-lg sm:text-xl font-bold mb-4">
//                   Thông tin đơn hàng
//                 </h2>
//                 <div className="flex justify-between items-center py-4 border-y border-gray-200 mb-4">
//                   <span className="font-medium text-sm sm:text-base">
//                     Tổng tiền:
//                   </span>
//                   <span className="text-red-600 font-bold text-lg sm:text-2xl">
//                     {formatPrice(subtotal)}
//                   </span>
//                 </div>
//                 <p className="text-[11px] sm:text-xs text-gray-500 mb-4">
//                   • Phí vận chuyển sẽ được tính ở trang thanh toán.
//                 </p>
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-red-600 text-white py-3 sm:py-3.5 rounded-md font-semibold hover:bg-red-700 transition-colors text-xs sm:text-sm"
//                 >
//                   THANH TOÁN
//                 </button>
//               </div>

//               <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-5 text-xs sm:text-sm space-y-3">
//                 <p className="font-semibold text-gray-900">
//                   Chính sách mua hàng:
//                 </p>

//                 <div className="space-y-2.5">
//                   {/* Đổi trả */}
//                   <div>
//                     <p className="font-medium text-gray-900">🔄 Đổi trả hàng</p>
//                     <p className="text-gray-700 mt-0.5">
//                       Hỗ trợ đổi size/màu trong vòng 3 ngày kể từ khi nhận hàng,
//                       sản phẩm còn nguyên tem mác, chưa qua sử dụng hoặc giặt
//                       tẩy.
//                     </p>
//                   </div>

//                   {/* Sản phẩm lỗi */}
//                   <div>
//                     <p className="font-medium text-gray-900">⚠️ Sản phẩm lỗi</p>
//                     <p className="text-gray-700 mt-0.5">
//                       Nếu sản phẩm bị lỗi do nhà sản xuất (đường may, form dáng,
//                       chất vải...), vui lòng chụp ảnh/quay video tình trạng sản
//                       phẩm và liên hệ ngay để được đổi mới miễn phí.
//                     </p>
//                   </div>

//                   {/* Liên hệ */}
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       📩 Liên hệ hỗ trợ
//                     </p>
//                     <p className="text-gray-700 mt-0.5">
//                       Mọi thắc mắc về đổi trả hoặc sản phẩm lỗi, vui lòng nhắn
//                       tin trực tiếp qua Instagram{" "}
//                       <a
//                         href="https://www.instagram.com/caviolddie/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="font-semibold text-blue-600 hover:underline"
//                       >
//                         @cavioddie
//                       </a>{" "}
//                       để được hỗ trợ nhanh nhất.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="border border-gray-200 rounded-lg p-4 sm:p-5">
//                 <p className="font-semibold text-xs sm:text-sm">
//                   Khuyến mãi dành cho bạn
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShoppingCart;
"use client";

import { useState } from "react";
import { Minus, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCart,
  getImageUrl,
  getEffectivePrice,
} from "@/contexts/CartContext";

const ShoppingCart = () => {
  const {
    cartItems,
    loading,
    error,
    updatingId,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  const [note, setNote] = useState("");
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Không cần tự lưu cartItems vào localStorage nữa: trang /checkout
  // sẽ tự lấy dữ liệu mới nhất từ CartContext (nguồn dữ liệu chung),
  // nên không còn nguy cơ đi thanh toán với dữ liệu cũ/đã xóa.
  const handleCheckout = () => {
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
                    const isUpdating = updatingId === item._id;

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
                            disabled={isUpdating}
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
                              disabled={item.quantity === 1 || isUpdating}
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
                              disabled={isUpdating}
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
                  className="w-full bg-red-600 text-white py-3 sm:py-3.5 rounded-md font-semibold hover:bg-red-700 transition-colors text-xs sm:text-sm"
                >
                  THANH TOÁN
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-5 text-xs sm:text-sm space-y-3">
                <p className="font-semibold text-gray-900">
                  Chính sách mua hàng:
                </p>

                <div className="space-y-2.5">
                  <div>
                    <p className="font-medium text-gray-900">🔄 Đổi trả hàng</p>
                    <p className="text-gray-700 mt-0.5">
                      Hỗ trợ đổi size/màu trong vòng 3 ngày kể từ khi nhận hàng,
                      sản phẩm còn nguyên tem mác, chưa qua sử dụng hoặc giặt
                      tẩy.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">⚠️ Sản phẩm lỗi</p>
                    <p className="text-gray-700 mt-0.5">
                      Nếu sản phẩm bị lỗi do nhà sản xuất (đường may, form dáng,
                      chất vải...), vui lòng chụp ảnh/quay video tình trạng sản
                      phẩm và liên hệ ngay để được đổi mới miễn phí.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      📩 Liên hệ hỗ trợ
                    </p>
                    <p className="text-gray-700 mt-0.5">
                      Mọi thắc mắc về đổi trả hoặc sản phẩm lỗi, vui lòng nhắn
                      tin trực tiếp qua Instagram{" "}
                      <a
                        href="https://www.instagram.com/caviolddie/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        @cavioddie
                      </a>{" "}
                      để được hỗ trợ nhanh nhất.
                    </p>
                  </div>
                </div>
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
