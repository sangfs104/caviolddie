// // "use client";

// // import { Minus, Plus, X } from "lucide-react";
// // import Image from "next/image";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";

// // // ==================== TYPES ====================

// // interface Variant {
// //   _id?: string;
// //   size?: string;
// //   color?: string;
// //   price: number;
// //   discountPrice?: number;
// //   image?: string;
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   images?: string[];
// // }

// // export interface CartItem {
// //   _id: string;
// //   quantity: number;
// //   product: Product;
// //   variant?: Variant;
// // }

// // interface CartDrawerProps {
// //   open: boolean;
// //   onClose: () => void;
// //   items: CartItem[];
// //   updatingId: string | null;
// //   onUpdateQuantity: (
// //     itemId: string,
// //     productId: string,
// //     variantId: string | undefined,
// //     newQuantity: number,
// //   ) => void;
// //   onRemoveItem: (
// //     itemId: string,
// //     productId: string,
// //     variantId: string | undefined,
// //   ) => void;
// // }

// // // Chuẩn hoá đường dẫn ảnh: nối domain backend nếu là path tương đối
// // const getImageUrl = (imgPath?: string): string => {
// //   if (!imgPath) return "/img/placeholder.jpg";
// //   if (imgPath.startsWith("http")) {
// //     return imgPath.replace(/^http:\/\//, "https://");
// //   }
// //   return `${process.env.NEXT_PUBLIC_API_URL}${
// //     imgPath.startsWith("/") ? "" : "/"
// //   }${imgPath}`;
// // };

// // const priceFormatter = new Intl.NumberFormat("vi-VN", {
// //   style: "currency",
// //   currency: "VND",
// // });

// // const getEffectivePrice = (item: CartItem) => {
// //   const variant = item.variant;
// //   return variant?.discountPrice && variant.discountPrice < variant.price
// //     ? variant.discountPrice
// //     : variant?.price || 0;
// // };

// // const CartDrawer: React.FC<CartDrawerProps> = ({
// //   open,
// //   onClose,
// //   items,
// //   updatingId,
// //   onUpdateQuantity,
// //   onRemoveItem,
// // }) => {
// //   const router = useRouter();

// //   const subtotal = items.reduce(
// //     (total, item) => total + getEffectivePrice(item) * item.quantity,
// //     0,
// //   );

// //   // Đóng drawer trước rồi mới điều hướng, đảm bảo luôn chuyển được
// //   // sang /checkout kể cả khi có logic chặn sự kiện click ở đâu đó khác
// //   // (ví dụ overlay, animation transition...).
// //   const handleCheckoutClick = () => {
// //     onClose();
// //     router.push("/checkout");
// //   };

// //   return (
// //     <>
// //       {/* Lớp phủ nền tối */}
// //       <div
// //         onClick={onClose}
// //         className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
// //           open ? "opacity-100 visible" : "opacity-0 invisible"
// //         }`}
// //         aria-hidden="true"
// //       />

// //       {/* Panel giỏ hàng trượt từ bên phải */}
// //       <aside
// //         className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-out ${
// //           open ? "translate-x-0" : "translate-x-full"
// //         }`}
// //         role="dialog"
// //         aria-modal="true"
// //         aria-label="Giỏ hàng"
// //       >
// //         {/* Header */}
// //         <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex-shrink-0">
// //           <h2 className="text-lg sm:text-xl font-semibold">Giỏ hàng</h2>
// //           <button
// //             onClick={onClose}
// //             className="text-gray-700 hover:text-black transition-colors"
// //             aria-label="Đóng giỏ hàng"
// //           >
// //             <X size={22} />
// //           </button>
// //         </div>

// //         {/* Danh sách sản phẩm */}
// //         <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
// //           {items.length === 0 ? (
// //             <p className="text-sm text-gray-500 text-center py-12">
// //               Giỏ hàng của bạn đang trống
// //             </p>
// //           ) : (
// //             <div className="space-y-5 sm:space-y-6">
// //               {items.map((item) => {
// //                 const variantLabel = [item.variant?.color, item.variant?.size]
// //                   .filter(Boolean)
// //                   .join(" / ");
// //                 const isUpdating = updatingId === item._id;

// //                 return (
// //                   <div key={item._id} className="flex gap-3">
// //                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
// //                       <Image
// //                         src={getImageUrl(
// //                           item.variant?.image || item.product?.images?.[0],
// //                         )}
// //                         alt={item.product?.name || "Sản phẩm"}
// //                         width={80}
// //                         height={80}
// //                         unoptimized
// //                         className="w-full h-full object-cover"
// //                       />
// //                     </div>

// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-start justify-between gap-2">
// //                         <div className="min-w-0">
// //                           <p className="text-xs sm:text-sm font-medium truncate">
// //                             {item.product?.name || "Không có tên"}
// //                           </p>
// //                           {variantLabel && (
// //                             <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
// //                               {variantLabel}
// //                             </p>
// //                           )}
// //                         </div>
// //                         <button
// //                           onClick={() =>
// //                             onRemoveItem(
// //                               item._id,
// //                               item.product._id,
// //                               item.variant?._id,
// //                             )
// //                           }
// //                           disabled={isUpdating}
// //                           className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-40"
// //                           aria-label="Xóa sản phẩm"
// //                         >
// //                           <X size={16} />
// //                         </button>
// //                       </div>

// //                       <div className="flex items-end justify-between mt-2.5">
// //                         <div className="flex items-center border border-gray-300 rounded-md">
// //                           <button
// //                             onClick={() =>
// //                               onUpdateQuantity(
// //                                 item._id,
// //                                 item.product._id,
// //                                 item.variant?._id,
// //                                 item.quantity - 1,
// //                               )
// //                             }
// //                             disabled={item.quantity === 1 || isUpdating}
// //                             className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
// //                           >
// //                             <Minus className="w-3 h-3" />
// //                           </button>
// //                           <span className="px-3 min-w-[32px] text-center text-xs sm:text-sm">
// //                             {item.quantity}
// //                           </span>
// //                           <button
// //                             onClick={() =>
// //                               onUpdateQuantity(
// //                                 item._id,
// //                                 item.product._id,
// //                                 item.variant?._id,
// //                                 item.quantity + 1,
// //                               )
// //                             }
// //                             disabled={isUpdating}
// //                             className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
// //                           >
// //                             <Plus className="w-3 h-3" />
// //                           </button>
// //                         </div>

// //                         <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
// //                           {priceFormatter.format(
// //                             getEffectivePrice(item) * item.quantity,
// //                           )}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer: tổng tiền + thanh toán */}
// //         {items.length > 0 && (
// //           <div className="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0 space-y-3">
// //             <div className="flex items-center justify-between">
// //               <span className="text-sm font-medium">TỔNG TIỀN:</span>
// //               <span className="text-red-600 font-bold text-base sm:text-lg">
// //                 {priceFormatter.format(subtotal)}
// //               </span>
// //             </div>

// //             <button
// //               type="button"
// //               onClick={handleCheckoutClick}
// //               className="block w-full text-center bg-red-600 text-white py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors"
// //             >
// //               THANH TOÁN
// //             </button>

// //             <div className="flex items-center justify-between text-xs pt-1">
// //               <Link
// //                 href="/cart"
// //                 onClick={onClose}
// //                 className="text-blue-600 underline hover:no-underline"
// //               >
// //                 Xem giỏ hàng
// //               </Link>
// //               <Link
// //                 href="/promotions"
// //                 onClick={onClose}
// //                 className="text-blue-600 underline hover:no-underline"
// //               >
// //                 Khuyến mãi dành cho bạn
// //               </Link>
// //             </div>
// //           </div>
// //         )}
// //       </aside>
// //     </>
// //   );
// // };

// // export default CartDrawer;
// "use client";

// import { Minus, Plus, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// // ==================== TYPES ====================

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

// export interface CartItem {
//   _id: string;
//   quantity: number;
//   product: Product;
//   variant?: Variant;
// }

// interface CartDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   items: CartItem[];
//   updatingId: string | null;
//   onUpdateQuantity: (
//     itemId: string,
//     productId: string,
//     variantId: string | undefined,
//     newQuantity: number,
//   ) => void;
//   onRemoveItem: (
//     itemId: string,
//     productId: string,
//     variantId: string | undefined,
//   ) => void;
// }

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

// const priceFormatter = new Intl.NumberFormat("vi-VN", {
//   style: "currency",
//   currency: "VND",
// });

// const getEffectivePrice = (item: CartItem) => {
//   const variant = item.variant;
//   return variant?.discountPrice && variant.discountPrice < variant.price
//     ? variant.discountPrice
//     : variant?.price || 0;
// };

// const CartDrawer: React.FC<CartDrawerProps> = ({
//   open,
//   onClose,
//   items,
//   updatingId,
//   onUpdateQuantity,
//   onRemoveItem,
// }) => {
//   const router = useRouter();

//   const subtotal = items.reduce(
//     (total, item) => total + getEffectivePrice(item) * item.quantity,
//     0,
//   );

//   // Đóng drawer trước rồi mới điều hướng, đảm bảo luôn chuyển được
//   // sang /checkout kể cả khi có logic chặn sự kiện click ở đâu đó khác
//   // (ví dụ overlay, animation transition...).
//   const handleCheckoutClick = () => {
//     onClose();
//     router.push("/checkout");
//   };

//   return (
//     <>
//       {/* Lớp phủ nền tối */}
//       <div
//         onClick={onClose}
//         className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
//           open ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         aria-hidden="true"
//       />

//       {/* Panel giỏ hàng trượt từ bên phải */}
//       <aside
//         className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-out ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//         role="dialog"
//         aria-modal="true"
//         aria-label="Giỏ hàng"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex-shrink-0">
//           <h2 className="text-lg sm:text-xl font-semibold">Giỏ hàng</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-700 hover:text-black transition-colors"
//             aria-label="Đóng giỏ hàng"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Danh sách sản phẩm */}
//         <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
//           {items.length === 0 ? (
//             <p className="text-sm text-gray-500 text-center py-12">
//               Giỏ hàng của bạn đang trống
//             </p>
//           ) : (
//             <div className="space-y-5 sm:space-y-6">
//               {items.map((item) => {
//                 const variantLabel = [item.variant?.color, item.variant?.size]
//                   .filter(Boolean)
//                   .join(" / ");
//                 const isUpdating = updatingId === item._id;

//                 return (
//                   <div key={item._id} className="flex gap-3">
//                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
//                       <Image
//                         src={getImageUrl(
//                           item.variant?.image || item.product?.images?.[0],
//                         )}
//                         alt={item.product?.name || "Sản phẩm"}
//                         width={80}
//                         height={80}
//                         unoptimized
//                         className="w-full h-full object-cover"
//                       />
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="min-w-0">
//                           <p className="text-xs sm:text-sm font-medium truncate">
//                             {item.product?.name || "Không có tên"}
//                           </p>
//                           {variantLabel && (
//                             <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
//                               {variantLabel}
//                             </p>
//                           )}
//                         </div>
//                         <button
//                           onClick={() =>
//                             onRemoveItem(
//                               item._id,
//                               item.product._id,
//                               item.variant?._id,
//                             )
//                           }
//                           disabled={isUpdating}
//                           className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-40"
//                           aria-label="Xóa sản phẩm"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>

//                       <div className="flex items-end justify-between mt-2.5">
//                         <div className="flex items-center border border-gray-300 rounded-md">
//                           <button
//                             onClick={() =>
//                               onUpdateQuantity(
//                                 item._id,
//                                 item.product._id,
//                                 item.variant?._id,
//                                 item.quantity - 1,
//                               )
//                             }
//                             disabled={item.quantity === 1 || isUpdating}
//                             className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
//                           >
//                             <Minus className="w-3 h-3" />
//                           </button>
//                           <span className="px-3 min-w-[32px] text-center text-xs sm:text-sm">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() =>
//                               onUpdateQuantity(
//                                 item._id,
//                                 item.product._id,
//                                 item.variant?._id,
//                                 item.quantity + 1,
//                               )
//                             }
//                             disabled={isUpdating}
//                             className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
//                           >
//                             <Plus className="w-3 h-3" />
//                           </button>
//                         </div>

//                         <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
//                           {priceFormatter.format(
//                             getEffectivePrice(item) * item.quantity,
//                           )}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Footer: tổng tiền + thanh toán */}
//         {items.length > 0 && (
//           <div className="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0 space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">TỔNG TIỀN:</span>
//               <span className="text-red-600 font-bold text-base sm:text-lg">
//                 {priceFormatter.format(subtotal)}
//               </span>
//             </div>

//             <div className="flex items-center gap-3">
//               <Link
//                 href="/cart"
//                 onClick={onClose}
//                 className="flex-1 text-center border border-gray-300 text-gray-800 py-3 rounded-full font-semibold text-xs sm:text-sm hover:border-black hover:bg-gray-50 transition-colors"
//               >
//                 XEM GIỎ HÀNG
//               </Link>
//               <button
//                 type="button"
//                 onClick={handleCheckoutClick}
//                 className="flex-1 text-center bg-red-600 text-white py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors"
//               >
//                 THANH TOÁN
//               </button>
//             </div>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// };

// export default CartDrawer;
"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCart,
  getImageUrl,
  getEffectivePrice,
} from "@/contexts/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

// CartDrawer giờ tự lấy dữ liệu từ CartContext (nguồn dữ liệu chung với
// ShoppingCart và trang Checkout) thay vì nhận items/updatingId qua props.
// => Không còn tình trạng dữ liệu trong drawer bị "lệch" so với nơi khác.
const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const { cartItems, updatingId, subtotal, updateQuantity, removeItem } =
    useCart();

  // Không cần lưu localStorage nữa: trang /checkout tự lấy dữ liệu mới
  // nhất trực tiếp từ CartContext, nên bấm thanh toán ngay trong drawer
  // sau khi vừa xóa/sửa sản phẩm vẫn luôn đúng dữ liệu hiện tại.
  const handleCheckoutClick = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* Lớp phủ nền tối */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden="true"
      />

      {/* Panel giỏ hàng trượt từ bên phải */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold">Giỏ hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-black transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X size={22} />
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12">
              Giỏ hàng của bạn đang trống
            </p>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {cartItems.map((item) => {
                const variantLabel = [item.variant?.color, item.variant?.size]
                  .filter(Boolean)
                  .join(" / ");
                const isUpdating = updatingId === item._id;

                return (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(
                          item.variant?.image || item.product?.images?.[0],
                        )}
                        alt={item.product?.name || "Sản phẩm"}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {item.product?.name || "Không có tên"}
                          </p>
                          {variantLabel && (
                            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                              {variantLabel}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            removeItem(
                              item._id,
                              item.product._id,
                              item.variant?._id,
                            )
                          }
                          disabled={isUpdating}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-40"
                          aria-label="Xóa sản phẩm"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-2.5">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.product._id,
                                item.variant?._id,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity === 1 || isUpdating}
                            className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 min-w-[32px] text-center text-xs sm:text-sm">
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
                            disabled={isUpdating}
                            className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                          {priceFormatter.format(
                            getEffectivePrice(item) * item.quantity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: tổng tiền + thanh toán */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">TỔNG TIỀN:</span>
              <span className="text-red-600 font-bold text-base sm:text-lg">
                {priceFormatter.format(subtotal)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex-1 text-center border border-gray-300 text-gray-800 py-3 rounded-full font-semibold text-xs sm:text-sm hover:border-black hover:bg-gray-50 transition-colors"
              >
                XEM GIỎ HÀNG
              </Link>
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="flex-1 text-center bg-red-600 text-white py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors"
              >
                THANH TOÁN
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
