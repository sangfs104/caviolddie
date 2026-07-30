// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import Image from "next/image";

// // // // ==================== TYPES ====================

// // // interface Variant {
// // //   _id: string;
// // //   size?: string;
// // //   color?: string;
// // //   price: number;
// // //   discountPrice?: number;
// // //   image?: string;
// // //   stock?: number;
// // // }

// // // interface Product {
// // //   _id: string;
// // //   name: string;
// // //   price: number;
// // //   discountPrice?: number;
// // //   images?: string[];
// // // }

// // // interface CartItem {
// // //   _id: string;
// // //   product: Product;
// // //   variant?: Variant;
// // //   quantity: number;
// // // }

// // // interface Address {
// // //   _id: string;
// // //   fullName: string;
// // //   phone: string;
// // //   address: string;
// // //   city: string;
// // //   country: string;
// // //   isDefault?: boolean;
// // // }

// // // interface NewAddress {
// // //   fullName: string;
// // //   phone: string;
// // //   address: string;
// // //   city: string;
// // //   country: string;
// // //   isDefault: boolean;
// // // }

// // // // ==================== HELPERS ====================

// // // const getUserId = () => {
// // //   if (typeof window !== "undefined") {
// // //     const user = JSON.parse(localStorage.getItem("user") || "null");
// // //     if (user?.id) return user.id;
// // //     return localStorage.getItem("guestId") || "";
// // //   }
// // //   return "";
// // // };

// // // const getEffectivePrice = (item: CartItem): number => {
// // //   if (
// // //     item.variant?.discountPrice &&
// // //     item.variant.discountPrice < item.variant.price
// // //   ) {
// // //     return item.variant.discountPrice;
// // //   }
// // //   if (item.variant?.price) return item.variant.price;
// // //   if (
// // //     item.product?.discountPrice &&
// // //     item.product.discountPrice < item.product.price
// // //   ) {
// // //     return item.product.discountPrice;
// // //   }
// // //   return item.product?.price ?? 0;
// // // };

// // // const getOriginalPrice = (item: CartItem): number =>
// // //   item.variant?.price ?? item.product?.price ?? 0;

// // // const isOnSale = (item: CartItem): boolean =>
// // //   !!(
// // //     item.variant?.discountPrice &&
// // //     item.variant.discountPrice < item.variant.price
// // //   ) ||
// // //   !!(
// // //     item.product?.discountPrice &&
// // //     item.product.discountPrice < item.product.price
// // //   );

// // // // ==================== COMPONENT ====================

// // // const CheckoutPage = () => {
// // //   const router = useRouter();
// // //   const userId = getUserId();

// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// // //   const [addresses, setAddresses] = useState<Address[]>([]);
// // //   const [selectedAddress, setSelectedAddress] = useState<string>("");
// // //   const [useNewAddress, setUseNewAddress] = useState(false);
// // //   const [newAddress, setNewAddress] = useState<NewAddress>({
// // //     fullName: "",
// // //     phone: "",
// // //     address: "",
// // //     city: "",
// // //     country: "",
// // //     isDefault: false,
// // //   });
// // //   const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
// // //     "cash",
// // //   );
// // //   const [loading, setLoading] = useState(true);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const formatPrice = (price: number) =>
// // //     new Intl.NumberFormat("vi-VN", {
// // //       style: "currency",
// // //       currency: "VND",
// // //     }).format(price);

// // //   useEffect(() => {
// // //     // Bắt đăng nhập trước khi vào trang thanh toán
// // //     const token = localStorage.getItem("token");
// // //     if (!token) {
// // //       router.push("/login?redirect=/checkout");
// // //       return;
// // //     }

// // //     const fetchCart = async () => {
// // //       try {
// // //         const res = await fetch(
// // //           `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
// // //           {
// // //             credentials: "include",
// // //           },
// // //         );
// // //         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// // //         const data = await res.json();
// // //         setCartItems(data.items || []);
// // //       } catch (err: unknown) {
// // //         setError(
// // //           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
// // //         );
// // //       }
// // //     };

// // //     const fetchAddresses = async () => {
// // //       try {
// // //         const res = await fetch(
// // //           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
// // //           {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //             credentials: "include",
// // //           },
// // //         );
// // //         if (!res.ok) {
// // //           const errorData = await res.json().catch(() => ({}));
// // //           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
// // //         }
// // //         const data: Address[] = await res.json();
// // //         setAddresses(data);
// // //         const defaultAddress = data.find((addr) => addr.isDefault);
// // //         if (defaultAddress) setSelectedAddress(defaultAddress._id);
// // //       } catch (err: unknown) {
// // //         setError(
// // //           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
// // //         );
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCart();
// // //     fetchAddresses();
// // //   }, [userId, router]);

// // //   const subtotal = cartItems.reduce(
// // //     (total, item) => total + getEffectivePrice(item) * item.quantity,
// // //     0,
// // //   );

// // //   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setNewAddress((prev) => ({
// // //       ...prev,
// // //       [name]: type === "checkbox" ? checked : value,
// // //     }));
// // //   };

// // //   const handleCheckout = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     const token = localStorage.getItem("token");
// // //     if (!token) {
// // //       router.push("/login?redirect=/checkout");
// // //       return;
// // //     }
// // //     if (!selectedAddress && !useNewAddress) {
// // //       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
// // //       return;
// // //     }
// // //     if (cartItems.length === 0) {
// // //       setError("Giỏ hàng trống.");
// // //       return;
// // //     }
// // //     if (
// // //       useNewAddress &&
// // //       (!newAddress.fullName ||
// // //         !newAddress.phone ||
// // //         !newAddress.address ||
// // //         !newAddress.city ||
// // //         !newAddress.country)
// // //     ) {
// // //       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
// // //       return;
// // //     }

// // //     setSubmitting(true);
// // //     setError(null);

// // //     try {
// // //       const payload = {
// // //         products: cartItems.map((item) => ({
// // //           product: item.product._id,
// // //           variant: item.variant?._id,
// // //           quantity: item.quantity,
// // //         })),
// // //         totalPrice: subtotal,
// // //         paymentMethod,
// // //         ...(useNewAddress
// // //           ? { newShippingAddress: newAddress }
// // //           : { shippingAddress: selectedAddress }),
// // //       };

// // //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         credentials: "include",
// // //         body: JSON.stringify(payload),
// // //       });

// // //       if (!res.ok) {
// // //         const errorData = await res.json().catch(() => ({}));
// // //         throw new Error(errorData.error || "Thanh toán thất bại");
// // //       }

// // //       const createdOrder = await res.json();

// // //       // Xóa giỏ hàng phía client (giỏ hàng thật đã được xử lý ở backend nếu có logic riêng)
// // //       window.dispatchEvent(new Event("cart-updated"));

// // //       router.push(`/order-confirmation?orderId=${createdOrder._id}`);
// // //     } catch (err: unknown) {
// // //       setError(
// // //         err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
// // //       );
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-white flex justify-center items-center">
// // //         Đang tải...
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
// // //         <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thanh toán</h1>

// // //         {/* Giỏ hàng */}
// // //         <div className="mb-6">
// // //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// // //             Giỏ hàng của bạn
// // //           </h2>
// // //           {cartItems.length === 0 ? (
// // //             <p className="text-gray-600">Giỏ hàng trống.</p>
// // //           ) : (
// // //             <div className="space-y-4">
// // //               {cartItems.map((item) => {
// // //                 const effectivePrice = getEffectivePrice(item);
// // //                 const originalPrice = getOriginalPrice(item);
// // //                 const onSale = isOnSale(item);

// // //                 return (
// // //                   <div
// // //                     key={item._id}
// // //                     className="flex items-center space-x-4 border-b pb-3"
// // //                   >
// // //                     <Image
// // //                       src={
// // //                         item.variant?.image ||
// // //                         item.product?.images?.[0] ||
// // //                         "/img/placeholder.jpg"
// // //                       }
// // //                       alt={item.product?.name || "Sản phẩm"}
// // //                       width={64}
// // //                       height={64}
// // //                       className="w-16 h-16 object-cover rounded"
// // //                     />
// // //                     <div className="flex-1">
// // //                       <div className="font-semibold">{item.product?.name}</div>
// // //                       {item.variant && (
// // //                         <div className="text-xs text-gray-500">
// // //                           Kích thước: {item.variant.size} / Màu sắc:{" "}
// // //                           {item.variant.color}
// // //                         </div>
// // //                       )}
// // //                       <div className="text-xs text-gray-500">
// // //                         Số lượng: {item.quantity}
// // //                       </div>
// // //                       <div className="text-xs text-gray-500">
// // //                         {onSale ? (
// // //                           <div className="flex items-center space-x-2">
// // //                             <span className="text-red-500">
// // //                               {formatPrice(effectivePrice)}
// // //                             </span>
// // //                             <span className="line-through text-gray-400">
// // //                               {formatPrice(originalPrice)}
// // //                             </span>
// // //                           </div>
// // //                         ) : (
// // //                           <span>{formatPrice(effectivePrice)}</span>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                     <div className="font-semibold">
// // //                       {formatPrice(effectivePrice * item.quantity)}
// // //                     </div>
// // //                   </div>
// // //                 );
// // //               })}
// // //               <div className="flex justify-between font-semibold mt-4">
// // //                 <span>Tổng cộng</span>
// // //                 <span>{formatPrice(subtotal)}</span>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Địa chỉ giao hàng */}
// // //         <div className="mb-6">
// // //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// // //             Địa chỉ giao hàng
// // //           </h2>
// // //           {addresses.length > 0 && (
// // //             <div className="mb-4">
// // //               <h3 className="text-sm font-medium mb-2">Chọn địa chỉ có sẵn:</h3>
// // //               {addresses.map((addr) => (
// // //                 <div key={addr._id} className="flex items-center mb-2">
// // //                   <input
// // //                     type="radio"
// // //                     name="address"
// // //                     value={addr._id}
// // //                     checked={selectedAddress === addr._id}
// // //                     onChange={() => {
// // //                       setSelectedAddress(addr._id);
// // //                       setUseNewAddress(false);
// // //                     }}
// // //                     className="mr-2"
// // //                   />
// // //                   <div>
// // //                     <p className="font-semibold">{addr.fullName}</p>
// // //                     <p>
// // //                       {addr.address}, {addr.city}, {addr.country}
// // //                     </p>
// // //                     <p>SĐT: {addr.phone}</p>
// // //                     {addr.isDefault && (
// // //                       <span className="text-green-600 text-xs">[Mặc định]</span>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}

// // //           <div className="mb-4">
// // //             <label className="flex items-center">
// // //               <input
// // //                 type="checkbox"
// // //                 checked={useNewAddress}
// // //                 onChange={() => setUseNewAddress(!useNewAddress)}
// // //                 className="mr-2"
// // //               />
// // //               Nhập địa chỉ mới
// // //             </label>
// // //           </div>

// // //           {useNewAddress && (
// // //             <div className="space-y-4">
// // //               {(
// // //                 ["fullName", "phone", "address", "city", "country"] as const
// // //               ).map((field) => (
// // //                 <input
// // //                   key={field}
// // //                   type="text"
// // //                   name={field}
// // //                   value={newAddress[field]}
// // //                   onChange={handleNewAddressChange}
// // //                   placeholder={
// // //                     {
// // //                       fullName: "Họ và tên",
// // //                       phone: "Số điện thoại",
// // //                       address: "Địa chỉ",
// // //                       city: "Thành phố",
// // //                       country: "Quốc gia",
// // //                     }[field]
// // //                   }
// // //                   className="w-full border rounded px-3 py-2"
// // //                 />
// // //               ))}
// // //               <label className="flex items-center">
// // //                 <input
// // //                   type="checkbox"
// // //                   name="isDefault"
// // //                   checked={newAddress.isDefault}
// // //                   onChange={handleNewAddressChange}
// // //                   className="mr-2"
// // //                 />
// // //                 Đặt làm địa chỉ mặc định
// // //               </label>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Phương thức thanh toán */}
// // //         <div className="mb-6">
// // //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// // //             Phương thức thanh toán
// // //           </h2>
// // //           <div className="flex items-center space-x-6">
// // //             <label className="flex items-center">
// // //               <input
// // //                 type="radio"
// // //                 name="paymentMethod"
// // //                 value="cash"
// // //                 checked={paymentMethod === "cash"}
// // //                 onChange={() => setPaymentMethod("cash")}
// // //                 className="mr-2"
// // //               />
// // //               Thanh toán khi nhận hàng (COD)
// // //             </label>
// // //             <label className="flex items-center">
// // //               <input
// // //                 type="radio"
// // //                 name="paymentMethod"
// // //                 value="bank_transfer"
// // //                 checked={paymentMethod === "bank_transfer"}
// // //                 onChange={() => setPaymentMethod("bank_transfer")}
// // //                 className="mr-2"
// // //               />
// // //               Chuyển khoản ngân hàng
// // //             </label>
// // //           </div>
// // //         </div>

// // //         <form onSubmit={handleCheckout} className="space-y-4">
// // //           <button
// // //             type="submit"
// // //             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
// // //             disabled={
// // //               submitting ||
// // //               cartItems.length === 0 ||
// // //               (!selectedAddress && !useNewAddress)
// // //             }
// // //           >
// // //             {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
// // //           </button>
// // //           {error && <p className="text-red-600 text-sm">{error}</p>}
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CheckoutPage;
// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import Image from "next/image";

// // // ==================== TYPES ====================

// // interface Variant {
// //   _id: string;
// //   size?: string;
// //   color?: string;
// //   price: number;
// //   discountPrice?: number;
// //   image?: string;
// //   stock?: number;
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   price: number;
// //   discountPrice?: number;
// //   images?: string[];
// // }

// // interface CartItem {
// //   _id: string;
// //   product: Product;
// //   variant?: Variant;
// //   quantity: number;
// // }

// // interface Address {
// //   _id: string;
// //   fullName: string;
// //   phone: string;
// //   address: string;
// //   city: string;
// //   country: string;
// //   isDefault?: boolean;
// // }

// // interface NewAddress {
// //   fullName: string;
// //   phone: string;
// //   address: string;
// //   city: string;
// //   country: string;
// //   isDefault: boolean;
// // }

// // // ==================== HELPERS ====================

// // const getUserId = () => {
// //   if (typeof window !== "undefined") {
// //     const user = JSON.parse(localStorage.getItem("user") || "null");
// //     if (user?.id) return user.id;
// //     return localStorage.getItem("guestId") || "";
// //   }
// //   return "";
// // };

// // const getEffectivePrice = (item: CartItem): number => {
// //   if (
// //     item.variant?.discountPrice &&
// //     item.variant.discountPrice < item.variant.price
// //   ) {
// //     return item.variant.discountPrice;
// //   }
// //   if (item.variant?.price) return item.variant.price;
// //   if (
// //     item.product?.discountPrice &&
// //     item.product.discountPrice < item.product.price
// //   ) {
// //     return item.product.discountPrice;
// //   }
// //   return item.product?.price ?? 0;
// // };

// // const getOriginalPrice = (item: CartItem): number =>
// //   item.variant?.price ?? item.product?.price ?? 0;

// // const isOnSale = (item: CartItem): boolean =>
// //   !!(
// //     item.variant?.discountPrice &&
// //     item.variant.discountPrice < item.variant.price
// //   ) ||
// //   !!(
// //     item.product?.discountPrice &&
// //     item.product.discountPrice < item.product.price
// //   );

// // // ==================== SMALL UI PIECES ====================

// // const StepBadge = ({ n }: { n: number }) => (
// //   <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 font-serif text-sm text-neutral-900">
// //     {n}
// //   </span>
// // );

// // // ==================== COMPONENT ====================

// // const CheckoutPage = () => {
// //   const router = useRouter();
// //   const userId = getUserId();

// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// //   const [addresses, setAddresses] = useState<Address[]>([]);
// //   const [selectedAddress, setSelectedAddress] = useState<string>("");
// //   const [useNewAddress, setUseNewAddress] = useState(false);
// //   const [newAddress, setNewAddress] = useState<NewAddress>({
// //     fullName: "",
// //     phone: "",
// //     address: "",
// //     city: "",
// //     country: "",
// //     isDefault: false,
// //   });
// //   const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
// //     "cash",
// //   );
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const formatPrice = (price: number) =>
// //     new Intl.NumberFormat("vi-VN", {
// //       style: "currency",
// //       currency: "VND",
// //     }).format(price);

// //   useEffect(() => {
// //     // Bắt đăng nhập trước khi vào trang thanh toán
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       router.push("/login?redirect=/checkout");
// //       return;
// //     }

// //     const fetchCart = async () => {
// //       try {
// //         const res = await fetch(
// //           `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
// //           {
// //             credentials: "include",
// //           },
// //         );
// //         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// //         const data = await res.json();
// //         setCartItems(data.items || []);
// //       } catch (err: unknown) {
// //         setError(
// //           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
// //         );
// //       }
// //     };

// //     const fetchAddresses = async () => {
// //       try {
// //         const res = await fetch(
// //           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //             credentials: "include",
// //           },
// //         );
// //         if (!res.ok) {
// //           const errorData = await res.json().catch(() => ({}));
// //           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
// //         }
// //         const data: Address[] = await res.json();
// //         setAddresses(data);
// //         const defaultAddress = data.find((addr) => addr.isDefault);
// //         if (defaultAddress) setSelectedAddress(defaultAddress._id);
// //         else if (data.length === 0) setUseNewAddress(true);
// //       } catch (err: unknown) {
// //         setError(
// //           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCart();
// //     fetchAddresses();
// //   }, [userId, router]);

// //   const subtotal = cartItems.reduce(
// //     (total, item) => total + getEffectivePrice(item) * item.quantity,
// //     0,
// //   );

// //   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value, type, checked } = e.target;
// //     setNewAddress((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const handleCheckout = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       router.push("/login?redirect=/checkout");
// //       return;
// //     }
// //     if (!selectedAddress && !useNewAddress) {
// //       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
// //       return;
// //     }
// //     if (cartItems.length === 0) {
// //       setError("Giỏ hàng trống.");
// //       return;
// //     }
// //     if (
// //       useNewAddress &&
// //       (!newAddress.fullName ||
// //         !newAddress.phone ||
// //         !newAddress.address ||
// //         !newAddress.city ||
// //         !newAddress.country)
// //     ) {
// //       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
// //       return;
// //     }

// //     setSubmitting(true);
// //     setError(null);

// //     try {
// //       const payload = {
// //         products: cartItems.map((item) => ({
// //           product: item.product._id,
// //           variant: item.variant?._id,
// //           quantity: item.quantity,
// //         })),
// //         totalPrice: subtotal,
// //         paymentMethod,
// //         ...(useNewAddress
// //           ? { newShippingAddress: newAddress }
// //           : { shippingAddress: selectedAddress }),
// //       };

// //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         credentials: "include",
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         const errorData = await res.json().catch(() => ({}));
// //         throw new Error(errorData.error || "Thanh toán thất bại");
// //       }

// //       const createdOrder = await res.json();

// //       // Xóa giỏ hàng phía client (giỏ hàng thật đã được xử lý ở backend nếu có logic riêng)
// //       window.dispatchEvent(new Event("cart-updated"));

// //       router.push(`/order-confirmation?orderId=${createdOrder._id}`);
// //     } catch (err: unknown) {
// //       setError(
// //         err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
// //       );
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex min-h-screen items-center justify-center bg-white">
// //         <div className="flex items-center gap-3 text-neutral-500">
// //           <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
// //           <span className="text-sm">Đang tải...</span>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const canSubmit =
// //     submitting ||
// //     cartItems.length === 0 ||
// //     (!selectedAddress && !useNewAddress);

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
// //         {/* Header */}
// //         <div className="mb-10">
// //           <p className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-400">
// //             Giỏ hàng &middot; Thanh toán
// //           </p>
// //           <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
// //             Xác nhận đơn hàng
// //           </h1>
// //         </div>

// //         {error && (
// //           <div className="mb-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
// //             {error}
// //           </div>
// //         )}

// //         <form onSubmit={handleCheckout}>
// //           <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
// //             {/* ============ LEFT: STEPS ============ */}
// //             <div className="order-2 space-y-12 lg:order-1">
// //               {/* Step 1 — Shipping address */}
// //               <section>
// //                 <div className="mb-5 flex items-center gap-3">
// //                   <StepBadge n={1} />
// //                   <h2 className="text-lg font-semibold text-neutral-900">
// //                     Địa chỉ giao hàng
// //                   </h2>
// //                 </div>

// //                 <div className="ml-11 space-y-3">
// //                   {addresses.map((addr) => {
// //                     const checked =
// //                       selectedAddress === addr._id && !useNewAddress;
// //                     return (
// //                       <label
// //                         key={addr._id}
// //                         className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
// //                           checked
// //                             ? "border-neutral-900 bg-neutral-50"
// //                             : "border-neutral-200 hover:border-neutral-300"
// //                         }`}
// //                       >
// //                         <input
// //                           type="radio"
// //                           name="address"
// //                           value={addr._id}
// //                           checked={checked}
// //                           onChange={() => {
// //                             setSelectedAddress(addr._id);
// //                             setUseNewAddress(false);
// //                           }}
// //                           className="sr-only"
// //                         />
// //                         <span
// //                           className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
// //                             checked
// //                               ? "border-neutral-900"
// //                               : "border-neutral-300"
// //                           }`}
// //                         >
// //                           {checked && (
// //                             <span className="h-2 w-2 rounded-full bg-neutral-900" />
// //                           )}
// //                         </span>
// //                         <span className="text-sm">
// //                           <span className="flex items-center gap-2 font-semibold text-neutral-900">
// //                             {addr.fullName}
// //                             {addr.isDefault && (
// //                               <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
// //                                 Mặc định
// //                               </span>
// //                             )}
// //                           </span>
// //                           <span className="block text-neutral-600">
// //                             {addr.address}, {addr.city}, {addr.country}
// //                           </span>
// //                           <span className="block text-neutral-500">
// //                             SĐT: {addr.phone}
// //                           </span>
// //                         </span>
// //                       </label>
// //                     );
// //                   })}

// //                   <label
// //                     className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
// //                       useNewAddress
// //                         ? "border-neutral-900 bg-neutral-50"
// //                         : "border-dashed border-neutral-300 hover:border-neutral-400"
// //                     }`}
// //                   >
// //                     <input
// //                       type="checkbox"
// //                       checked={useNewAddress}
// //                       onChange={() => setUseNewAddress(!useNewAddress)}
// //                       className="sr-only"
// //                     />
// //                     <span
// //                       className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
// //                         useNewAddress
// //                           ? "border-neutral-900"
// //                           : "border-neutral-300"
// //                       }`}
// //                     >
// //                       {useNewAddress && (
// //                         <span className="h-2 w-2 rounded-full bg-neutral-900" />
// //                       )}
// //                     </span>
// //                     <span className="font-medium text-neutral-900">
// //                       + Nhập địa chỉ mới
// //                     </span>
// //                   </label>

// //                   {useNewAddress && (
// //                     <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2">
// //                       {(
// //                         [
// //                           "fullName",
// //                           "phone",
// //                           "address",
// //                           "city",
// //                           "country",
// //                         ] as const
// //                       ).map((field) => (
// //                         <input
// //                           key={field}
// //                           type="text"
// //                           name={field}
// //                           value={newAddress[field]}
// //                           onChange={handleNewAddressChange}
// //                           placeholder={
// //                             {
// //                               fullName: "Họ và tên",
// //                               phone: "Số điện thoại",
// //                               address: "Địa chỉ",
// //                               city: "Thành phố",
// //                               country: "Quốc gia",
// //                             }[field]
// //                           }
// //                           className={`rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 ${
// //                             field === "address" ? "sm:col-span-2" : ""
// //                           }`}
// //                         />
// //                       ))}
// //                       <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2">
// //                         <input
// //                           type="checkbox"
// //                           name="isDefault"
// //                           checked={newAddress.isDefault}
// //                           onChange={handleNewAddressChange}
// //                           className="h-4 w-4 rounded border-neutral-300"
// //                         />
// //                         Đặt làm địa chỉ mặc định
// //                       </label>
// //                     </div>
// //                   )}
// //                 </div>
// //               </section>

// //               {/* Step 2 — Payment method */}
// //               <section>
// //                 <div className="mb-5 flex items-center gap-3">
// //                   <StepBadge n={2} />
// //                   <h2 className="text-lg font-semibold text-neutral-900">
// //                     Phương thức thanh toán
// //                   </h2>
// //                 </div>

// //                 <div className="ml-11 grid grid-cols-1 gap-3 sm:grid-cols-2">
// //                   {(
// //                     [
// //                       {
// //                         value: "cash",
// //                         label: "Thanh toán khi nhận hàng",
// //                         sub: "COD",
// //                       },
// //                       {
// //                         value: "bank_transfer",
// //                         label: "Chuyển khoản ngân hàng",
// //                         sub: "Chuyển khoản",
// //                       },
// //                     ] as const
// //                   ).map((opt) => {
// //                     const checked = paymentMethod === opt.value;
// //                     return (
// //                       <label
// //                         key={opt.value}
// //                         className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
// //                           checked
// //                             ? "border-neutral-900 bg-neutral-50"
// //                             : "border-neutral-200 hover:border-neutral-300"
// //                         }`}
// //                       >
// //                         <input
// //                           type="radio"
// //                           name="paymentMethod"
// //                           value={opt.value}
// //                           checked={checked}
// //                           onChange={() => setPaymentMethod(opt.value)}
// //                           className="sr-only"
// //                         />
// //                         <span
// //                           className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
// //                             checked
// //                               ? "border-neutral-900"
// //                               : "border-neutral-300"
// //                           }`}
// //                         >
// //                           {checked && (
// //                             <span className="h-2 w-2 rounded-full bg-neutral-900" />
// //                           )}
// //                         </span>
// //                         <span className="text-sm font-medium text-neutral-900">
// //                           {opt.label}
// //                         </span>
// //                       </label>
// //                     );
// //                   })}
// //                 </div>
// //               </section>
// //             </div>

// //             {/* ============ RIGHT: ORDER SUMMARY (sticky) ============ */}
// //             <div className="order-1 lg:order-2">
// //               <div className="rounded-2xl border border-neutral-200 p-5 lg:sticky lg:top-8">
// //                 <h2 className="mb-4 text-lg font-semibold text-neutral-900">
// //                   Đơn hàng của bạn
// //                   <span className="ml-1 font-normal text-neutral-400">
// //                     ({cartItems.length})
// //                   </span>
// //                 </h2>

// //                 {cartItems.length === 0 ? (
// //                   <p className="text-sm text-neutral-500">Giỏ hàng trống.</p>
// //                 ) : (
// //                   <div className="max-h-80 space-y-4 overflow-y-auto pr-1 pt-2 -mt-2">
// //                     {cartItems.map((item) => {
// //                       const effectivePrice = getEffectivePrice(item);
// //                       const originalPrice = getOriginalPrice(item);
// //                       const onSale = isOnSale(item);

// //                       return (
// //                         <div key={item._id} className="flex gap-3">
// //                           <div className="relative shrink-0 overflow-visible">
// //                             <Image
// //                               src={
// //                                 item.variant?.image ||
// //                                 item.product?.images?.[0] ||
// //                                 "/img/placeholder.jpg"
// //                               }
// //                               alt={item.product?.name || "Sản phẩm"}
// //                               width={56}
// //                               height={56}
// //                               className="h-14 w-14 rounded-lg border border-neutral-200 object-cover"
// //                             />
// //                             <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[10px] font-medium text-white">
// //                               {item.quantity}
// //                             </span>
// //                           </div>
// //                           <div className="min-w-0 flex-1">
// //                             <p className="truncate text-sm font-medium text-neutral-900">
// //                               {item.product?.name}
// //                             </p>
// //                             {item.variant && (
// //                               <p className="text-xs text-neutral-500">
// //                                 {item.variant.size} / {item.variant.color}
// //                               </p>
// //                             )}
// //                             <div className="mt-0.5 text-xs">
// //                               {onSale ? (
// //                                 <span className="flex items-center gap-1.5">
// //                                   <span className="font-medium text-rose-600">
// //                                     {formatPrice(effectivePrice)}
// //                                   </span>
// //                                   <span className="text-neutral-400 line-through">
// //                                     {formatPrice(originalPrice)}
// //                                   </span>
// //                                 </span>
// //                               ) : (
// //                                 <span className="text-neutral-500">
// //                                   {formatPrice(effectivePrice)}
// //                                 </span>
// //                               )}
// //                             </div>
// //                           </div>
// //                           <div className="whitespace-nowrap text-sm font-semibold text-neutral-900">
// //                             {formatPrice(effectivePrice * item.quantity)}
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 )}

// //                 <div className="my-4 border-t border-dashed border-neutral-200" />

// //                 <div className="mb-5 flex items-center justify-between">
// //                   <span className="text-sm font-medium text-neutral-600">
// //                     Tổng cộng
// //                   </span>
// //                   <span className="font-serif text-xl text-neutral-900">
// //                     {formatPrice(subtotal)}
// //                   </span>
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   className="w-full rounded-lg bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
// //                   disabled={canSubmit}
// //                 >
// //                   {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
// //                 </button>

// //                 <p className="mt-3 text-center text-xs text-neutral-400">
// //                   Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của
// //                   chúng tôi.
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CheckoutPage;
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   useCart,
//   getEffectivePrice as getCartEffectivePrice,
// } from "@/contexts/CartContext";

// // ==================== TYPES ====================

// interface Address {
//   _id: string;
//   fullName: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
//   isDefault?: boolean;
// }

// interface NewAddress {
//   fullName: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
//   isDefault: boolean;
// }

// // ==================== SMALL UI PIECES ====================

// const StepBadge = ({ n }: { n: number }) => (
//   <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 font-serif text-sm text-neutral-900">
//     {n}
//   </span>
// );

// // ==================== COMPONENT ====================

// const CheckoutPage = () => {
//   const router = useRouter();

//   // Giỏ hàng lấy trực tiếp từ CartContext — nguồn dữ liệu DUY NHẤT dùng
//   // chung với ShoppingCart.tsx và CartDrawer.tsx. Nhờ vậy nếu người dùng
//   // vừa xóa/sửa sản phẩm ở nơi khác rồi mới vào checkout, dữ liệu ở đây
//   // luôn là dữ liệu mới nhất, không còn tình trạng đặt hàng với sản phẩm
//   // đã bị xóa khỏi giỏ.
//   const {
//     cartItems,
//     loading: cartLoading,
//     error: cartError,
//     subtotal,
//     refetchCart,
//   } = useCart();

//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddress, setSelectedAddress] = useState<string>("");
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [newAddress, setNewAddress] = useState<NewAddress>({
//     fullName: "",
//     phone: "",
//     address: "",
//     city: "",
//     country: "",
//     isDefault: false,
//   });
//   const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
//     "cash",
//   );
//   const [addressLoading, setAddressLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const formatPrice = (price: number) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);

//   useEffect(() => {
//     // Bắt đăng nhập trước khi vào trang thanh toán
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login?redirect=/checkout");
//       return;
//     }

//     // Đảm bảo giỏ hàng luôn mới nhất khi vào trang checkout (phòng trường
//     // hợp người dùng chỉnh sửa giỏ hàng ở tab khác hoặc quay lại bằng nút Back).
//     refetchCart();

//     const fetchAddresses = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             credentials: "include",
//           },
//         );
//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
//         }
//         const data: Address[] = await res.json();
//         setAddresses(data);
//         const defaultAddress = data.find((addr) => addr.isDefault);
//         if (defaultAddress) setSelectedAddress(defaultAddress._id);
//         else if (data.length === 0) setUseNewAddress(true);
//       } catch (err: unknown) {
//         setError(
//           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
//         );
//       } finally {
//         setAddressLoading(false);
//       }
//     };

//     fetchAddresses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [router]);

//   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setNewAddress((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCheckout = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login?redirect=/checkout");
//       return;
//     }
//     if (!selectedAddress && !useNewAddress) {
//       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
//       return;
//     }
//     if (cartItems.length === 0) {
//       setError("Giỏ hàng trống.");
//       return;
//     }
//     if (
//       useNewAddress &&
//       (!newAddress.fullName ||
//         !newAddress.phone ||
//         !newAddress.address ||
//         !newAddress.city ||
//         !newAddress.country)
//     ) {
//       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         products: cartItems.map((item) => ({
//           product: item.product._id,
//           variant: item.variant?._id,
//           quantity: item.quantity,
//         })),
//         totalPrice: subtotal,
//         paymentMethod,
//         ...(useNewAddress
//           ? { newShippingAddress: newAddress }
//           : { shippingAddress: selectedAddress }),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         // Nếu backend từ chối vì sản phẩm/variant không còn hợp lệ (đã bị
//         // xóa, hết hàng, giá thay đổi...), tải lại giỏ hàng mới nhất để
//         // người dùng thấy đúng tình trạng hiện tại thay vì bị kẹt với lỗi.
//         await refetchCart();
//         throw new Error(errorData.error || "Thanh toán thất bại");
//       }

//       const createdOrder = await res.json();

//       // Giỏ hàng thật đã được xử lý (xóa) ở backend khi tạo đơn thành công.
//       // Đồng bộ lại context để badge/số lượng giỏ hàng ở Header cập nhật ngay.
//       await refetchCart();
//       window.dispatchEvent(new Event("cart-updated"));

//       router.push(`/order-confirmation?orderId=${createdOrder._id}`);
//     } catch (err: unknown) {
//       setError(
//         err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const loading = cartLoading || addressLoading;

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-white">
//         <div className="flex items-center gap-3 text-neutral-500">
//           <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
//           <span className="text-sm">Đang tải...</span>
//         </div>
//       </div>
//     );
//   }

//   const displayError = error || cartError;

//   const canSubmit =
//     submitting ||
//     cartItems.length === 0 ||
//     (!selectedAddress && !useNewAddress);

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
//         {/* Header */}
//         <div className="mb-10">
//           <p className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-400">
//             Giỏ hàng &middot; Thanh toán
//           </p>
//           <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
//             Xác nhận đơn hàng
//           </h1>
//         </div>

//         {displayError && (
//           <div className="mb-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//             {displayError}
//           </div>
//         )}

//         <form onSubmit={handleCheckout}>
//           <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
//             {/* ============ LEFT: STEPS ============ */}
//             <div className="order-2 space-y-12 lg:order-1">
//               {/* Step 1 — Shipping address */}
//               <section>
//                 <div className="mb-5 flex items-center gap-3">
//                   <StepBadge n={1} />
//                   <h2 className="text-lg font-semibold text-neutral-900">
//                     Địa chỉ giao hàng
//                   </h2>
//                 </div>

//                 <div className="ml-11 space-y-3">
//                   {addresses.map((addr) => {
//                     const checked =
//                       selectedAddress === addr._id && !useNewAddress;
//                     return (
//                       <label
//                         key={addr._id}
//                         className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
//                           checked
//                             ? "border-neutral-900 bg-neutral-50"
//                             : "border-neutral-200 hover:border-neutral-300"
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name="address"
//                           value={addr._id}
//                           checked={checked}
//                           onChange={() => {
//                             setSelectedAddress(addr._id);
//                             setUseNewAddress(false);
//                           }}
//                           className="sr-only"
//                         />
//                         <span
//                           className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
//                             checked
//                               ? "border-neutral-900"
//                               : "border-neutral-300"
//                           }`}
//                         >
//                           {checked && (
//                             <span className="h-2 w-2 rounded-full bg-neutral-900" />
//                           )}
//                         </span>
//                         <span className="text-sm">
//                           <span className="flex items-center gap-2 font-semibold text-neutral-900">
//                             {addr.fullName}
//                             {addr.isDefault && (
//                               <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
//                                 Mặc định
//                               </span>
//                             )}
//                           </span>
//                           <span className="block text-neutral-600">
//                             {addr.address}, {addr.city}, {addr.country}
//                           </span>
//                           <span className="block text-neutral-500">
//                             SĐT: {addr.phone}
//                           </span>
//                         </span>
//                       </label>
//                     );
//                   })}

//                   <label
//                     className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
//                       useNewAddress
//                         ? "border-neutral-900 bg-neutral-50"
//                         : "border-dashed border-neutral-300 hover:border-neutral-400"
//                     }`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={useNewAddress}
//                       onChange={() => setUseNewAddress(!useNewAddress)}
//                       className="sr-only"
//                     />
//                     <span
//                       className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
//                         useNewAddress
//                           ? "border-neutral-900"
//                           : "border-neutral-300"
//                       }`}
//                     >
//                       {useNewAddress && (
//                         <span className="h-2 w-2 rounded-full bg-neutral-900" />
//                       )}
//                     </span>
//                     <span className="font-medium text-neutral-900">
//                       + Nhập địa chỉ mới
//                     </span>
//                   </label>

//                   {useNewAddress && (
//                     <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2">
//                       {(
//                         [
//                           "fullName",
//                           "phone",
//                           "address",
//                           "city",
//                           "country",
//                         ] as const
//                       ).map((field) => (
//                         <input
//                           key={field}
//                           type="text"
//                           name={field}
//                           value={newAddress[field]}
//                           onChange={handleNewAddressChange}
//                           placeholder={
//                             {
//                               fullName: "Họ và tên",
//                               phone: "Số điện thoại",
//                               address: "Địa chỉ",
//                               city: "Thành phố",
//                               country: "Quốc gia",
//                             }[field]
//                           }
//                           className={`rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 ${
//                             field === "address" ? "sm:col-span-2" : ""
//                           }`}
//                         />
//                       ))}
//                       <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2">
//                         <input
//                           type="checkbox"
//                           name="isDefault"
//                           checked={newAddress.isDefault}
//                           onChange={handleNewAddressChange}
//                           className="h-4 w-4 rounded border-neutral-300"
//                         />
//                         Đặt làm địa chỉ mặc định
//                       </label>
//                     </div>
//                   )}
//                 </div>
//               </section>

//               {/* Step 2 — Payment method */}
//               <section>
//                 <div className="mb-5 flex items-center gap-3">
//                   <StepBadge n={2} />
//                   <h2 className="text-lg font-semibold text-neutral-900">
//                     Phương thức thanh toán
//                   </h2>
//                 </div>

//                 <div className="ml-11 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                   {(
//                     [
//                       {
//                         value: "cash",
//                         label: "Thanh toán khi nhận hàng",
//                         sub: "COD",
//                       },
//                       {
//                         value: "bank_transfer",
//                         label: "Chuyển khoản ngân hàng",
//                         sub: "Chuyển khoản",
//                       },
//                     ] as const
//                   ).map((opt) => {
//                     const checked = paymentMethod === opt.value;
//                     return (
//                       <label
//                         key={opt.value}
//                         className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
//                           checked
//                             ? "border-neutral-900 bg-neutral-50"
//                             : "border-neutral-200 hover:border-neutral-300"
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name="paymentMethod"
//                           value={opt.value}
//                           checked={checked}
//                           onChange={() => setPaymentMethod(opt.value)}
//                           className="sr-only"
//                         />
//                         <span
//                           className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
//                             checked
//                               ? "border-neutral-900"
//                               : "border-neutral-300"
//                           }`}
//                         >
//                           {checked && (
//                             <span className="h-2 w-2 rounded-full bg-neutral-900" />
//                           )}
//                         </span>
//                         <span className="text-sm font-medium text-neutral-900">
//                           {opt.label}
//                         </span>
//                       </label>
//                     );
//                   })}
//                 </div>
//               </section>
//             </div>

//             {/* ============ RIGHT: ORDER SUMMARY (sticky) ============ */}
//             <div className="order-1 lg:order-2">
//               <div className="rounded-2xl border border-neutral-200 p-5 lg:sticky lg:top-8">
//                 <h2 className="mb-4 text-lg font-semibold text-neutral-900">
//                   Đơn hàng của bạn
//                   <span className="ml-1 font-normal text-neutral-400">
//                     ({cartItems.length})
//                   </span>
//                 </h2>

//                 {cartItems.length === 0 ? (
//                   <p className="text-sm text-neutral-500">Giỏ hàng trống.</p>
//                 ) : (
//                   <div className="max-h-80 space-y-4 overflow-y-auto pr-1 pt-2 -mt-2">
//                     {cartItems.map((item) => {
//                       const effectivePrice = getCartEffectivePrice(item);
//                       const originalPrice = item.variant?.price ?? 0;
//                       const onSale = !!(
//                         item.variant?.discountPrice &&
//                         item.variant.discountPrice < item.variant.price
//                       );

//                       return (
//                         <div key={item._id} className="flex gap-3">
//                           <div className="relative shrink-0 overflow-visible">
//                             <Image
//                               src={
//                                 item.variant?.image ||
//                                 item.product?.images?.[0] ||
//                                 "/img/placeholder.jpg"
//                               }
//                               alt={item.product?.name || "Sản phẩm"}
//                               width={56}
//                               height={56}
//                               className="h-14 w-14 rounded-lg border border-neutral-200 object-cover"
//                             />
//                             <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[10px] font-medium text-white">
//                               {item.quantity}
//                             </span>
//                           </div>
//                           <div className="min-w-0 flex-1">
//                             <p className="truncate text-sm font-medium text-neutral-900">
//                               {item.product?.name}
//                             </p>
//                             {item.variant && (
//                               <p className="text-xs text-neutral-500">
//                                 {item.variant.size} / {item.variant.color}
//                               </p>
//                             )}
//                             <div className="mt-0.5 text-xs">
//                               {onSale ? (
//                                 <span className="flex items-center gap-1.5">
//                                   <span className="font-medium text-rose-600">
//                                     {formatPrice(effectivePrice)}
//                                   </span>
//                                   <span className="text-neutral-400 line-through">
//                                     {formatPrice(originalPrice)}
//                                   </span>
//                                 </span>
//                               ) : (
//                                 <span className="text-neutral-500">
//                                   {formatPrice(effectivePrice)}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="whitespace-nowrap text-sm font-semibold text-neutral-900">
//                             {formatPrice(effectivePrice * item.quantity)}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 <div className="my-4 border-t border-dashed border-neutral-200" />

//                 <div className="mb-5 flex items-center justify-between">
//                   <span className="text-sm font-medium text-neutral-600">
//                     Tổng cộng
//                   </span>
//                   <span className="font-serif text-xl text-neutral-900">
//                     {formatPrice(subtotal)}
//                   </span>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full rounded-lg bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
//                   disabled={canSubmit}
//                 >
//                   {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
//                 </button>

//                 <p className="mt-3 text-center text-xs text-neutral-400">
//                   Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của
//                   chúng tôi.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useCart,
  getEffectivePrice as getCartEffectivePrice,
} from "@/contexts/CartContext";
import { apiFetch, SessionExpiredError } from "@/lib/apiClient";
import { isTokenValid } from "@/lib/auth";

// ==================== TYPES ====================

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

interface NewAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
}

// ==================== SMALL UI PIECES ====================

const StepBadge = ({ n }: { n: number }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 font-serif text-sm text-neutral-900">
    {n}
  </span>
);

// ==================== COMPONENT ====================

const CheckoutPage = () => {
  const router = useRouter();

  const {
    cartItems,
    loading: cartLoading,
    error: cartError,
    subtotal,
    refetchCart,
  } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    isDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
    "cash",
  );
  const [addressLoading, setAddressLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Chuyển hướng về login kèm lý do rõ ràng, tránh việc user không hiểu
  // vì sao đang thao tác lại bị đá ra.
  const redirectToLoginExpired = () => {
    router.push("/login?redirect=/checkout&reason=session_expired");
  };

  useEffect(() => {
    // ✅ Kiểm tra TOKEN CÒN HẠN chứ không chỉ "có tồn tại token hay không".
    // Trước đây chỉ check `if (!token)`, nên token hết hạn vẫn lọt qua bước
    // này, khiến các API gọi sau đó (địa chỉ, tạo đơn) mới lộ lỗi 401.
    const token = localStorage.getItem("token");
    if (!isTokenValid(token)) {
      redirectToLoginExpired();
      return;
    }

    refetchCart();

    const fetchAddresses = async () => {
      try {
        const res = await apiFetch("/api/address");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
        }
        const data: Address[] = await res.json();
        setAddresses(data);
        const defaultAddress = data.find((addr) => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
        else if (data.length === 0) setUseNewAddress(true);
      } catch (err: unknown) {
        // ✅ Phiên hết hạn -> điều hướng về login với thông báo, thay vì
        // hiện lỗi chung chung khiến user phải tự đoán cách xử lý.
        if (err instanceof SessionExpiredError) {
          redirectToLoginExpired();
          return;
        }
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
        );
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!isTokenValid(token)) {
      redirectToLoginExpired();
      return;
    }

    if (!selectedAddress && !useNewAddress) {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }
    if (
      useNewAddress &&
      (!newAddress.fullName ||
        !newAddress.phone ||
        !newAddress.address ||
        !newAddress.city ||
        !newAddress.country)
    ) {
      setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          variant: item.variant?._id,
          quantity: item.quantity,
        })),
        totalPrice: subtotal,
        paymentMethod,
        ...(useNewAddress
          ? { newShippingAddress: newAddress }
          : { shippingAddress: selectedAddress }),
      };

      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        await refetchCart();
        throw new Error(errorData.error || "Thanh toán thất bại");
      }

      const createdOrder = await res.json();

      await refetchCart();
      window.dispatchEvent(new Event("cart-updated"));

      router.push(`/order-confirmation?orderId=${createdOrder._id}`);
    } catch (err: unknown) {
      // ✅ Đây chính là trường hợp gây lỗi trong báo cáo của bạn: token hết
      // hạn qua đêm -> BE trả 401 khi tạo đơn -> trước đây rơi vào nhánh
      // "Thanh toán thất bại" chung chung. Giờ bắt riêng để điều hướng
      // đúng chỗ, kèm lý do rõ ràng.
      if (err instanceof SessionExpiredError) {
        redirectToLoginExpired();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const loading = cartLoading || addressLoading;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-neutral-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <span className="text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  const displayError = error || cartError;

  const canSubmit =
    submitting ||
    cartItems.length === 0 ||
    (!selectedAddress && !useNewAddress);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-400">
            Giỏ hàng &middot; Thanh toán
          </p>
          <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
            Xác nhận đơn hàng
          </h1>
        </div>

        {displayError && (
          <div className="mb-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {displayError}
          </div>
        )}

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
            {/* ============ LEFT: STEPS ============ */}
            <div className="order-2 space-y-12 lg:order-1">
              {/* Step 1 — Shipping address */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <StepBadge n={1} />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Địa chỉ giao hàng
                  </h2>
                </div>

                <div className="ml-11 space-y-3">
                  {addresses.map((addr) => {
                    const checked =
                      selectedAddress === addr._id && !useNewAddress;
                    return (
                      <label
                        key={addr._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                          checked
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr._id}
                          checked={checked}
                          onChange={() => {
                            setSelectedAddress(addr._id);
                            setUseNewAddress(false);
                          }}
                          className="sr-only"
                        />
                        <span
                          className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            checked
                              ? "border-neutral-900"
                              : "border-neutral-300"
                          }`}
                        >
                          {checked && (
                            <span className="h-2 w-2 rounded-full bg-neutral-900" />
                          )}
                        </span>
                        <span className="text-sm">
                          <span className="flex items-center gap-2 font-semibold text-neutral-900">
                            {addr.fullName}
                            {addr.isDefault && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                                Mặc định
                              </span>
                            )}
                          </span>
                          <span className="block text-neutral-600">
                            {addr.address}, {addr.city}, {addr.country}
                          </span>
                          <span className="block text-neutral-500">
                            SĐT: {addr.phone}
                          </span>
                        </span>
                      </label>
                    );
                  })}

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                      useNewAddress
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-dashed border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={useNewAddress}
                      onChange={() => setUseNewAddress(!useNewAddress)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        useNewAddress
                          ? "border-neutral-900"
                          : "border-neutral-300"
                      }`}
                    >
                      {useNewAddress && (
                        <span className="h-2 w-2 rounded-full bg-neutral-900" />
                      )}
                    </span>
                    <span className="font-medium text-neutral-900">
                      + Nhập địa chỉ mới
                    </span>
                  </label>

                  {useNewAddress && (
                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2">
                      {(
                        [
                          "fullName",
                          "phone",
                          "address",
                          "city",
                          "country",
                        ] as const
                      ).map((field) => (
                        <input
                          key={field}
                          type="text"
                          name={field}
                          value={newAddress[field]}
                          onChange={handleNewAddressChange}
                          placeholder={
                            {
                              fullName: "Họ và tên",
                              phone: "Số điện thoại",
                              address: "Địa chỉ",
                              city: "Thành phố",
                              country: "Quốc gia",
                            }[field]
                          }
                          className={`rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 ${
                            field === "address" ? "sm:col-span-2" : ""
                          }`}
                        />
                      ))}
                      <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={newAddress.isDefault}
                          onChange={handleNewAddressChange}
                          className="h-4 w-4 rounded border-neutral-300"
                        />
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>
                  )}
                </div>
              </section>

              {/* Step 2 — Payment method */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <StepBadge n={2} />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Phương thức thanh toán
                  </h2>
                </div>

                <div className="ml-11 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        value: "cash",
                        label: "Thanh toán khi nhận hàng",
                        sub: "COD",
                      },
                      {
                        value: "bank_transfer",
                        label: "Chuyển khoản ngân hàng",
                        sub: "Chuyển khoản",
                      },
                    ] as const
                  ).map((opt) => {
                    const checked = paymentMethod === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                          checked
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.value}
                          checked={checked}
                          onChange={() => setPaymentMethod(opt.value)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            checked
                              ? "border-neutral-900"
                              : "border-neutral-300"
                          }`}
                        >
                          {checked && (
                            <span className="h-2 w-2 rounded-full bg-neutral-900" />
                          )}
                        </span>
                        <span className="text-sm font-medium text-neutral-900">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* ============ RIGHT: ORDER SUMMARY (sticky) ============ */}
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl border border-neutral-200 p-5 lg:sticky lg:top-8">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                  Đơn hàng của bạn
                  <span className="ml-1 font-normal text-neutral-400">
                    ({cartItems.length})
                  </span>
                </h2>

                {cartItems.length === 0 ? (
                  <p className="text-sm text-neutral-500">Giỏ hàng trống.</p>
                ) : (
                  <div className="max-h-80 space-y-4 overflow-y-auto pr-1 pt-2 -mt-2">
                    {cartItems.map((item) => {
                      const effectivePrice = getCartEffectivePrice(item);
                      const originalPrice = item.variant?.price ?? 0;
                      const onSale = !!(
                        item.variant?.discountPrice &&
                        item.variant.discountPrice < item.variant.price
                      );

                      return (
                        <div key={item._id} className="flex gap-3">
                          <div className="relative shrink-0 overflow-visible">
                            <Image
                              src={
                                item.variant?.image ||
                                item.product?.images?.[0] ||
                                "/img/placeholder.jpg"
                              }
                              alt={item.product?.name || "Sản phẩm"}
                              width={56}
                              height={56}
                              className="h-14 w-14 rounded-lg border border-neutral-200 object-cover"
                            />
                            <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[10px] font-medium text-white">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-neutral-900">
                              {item.product?.name}
                            </p>
                            {item.variant && (
                              <p className="text-xs text-neutral-500">
                                {item.variant.size} / {item.variant.color}
                              </p>
                            )}
                            <div className="mt-0.5 text-xs">
                              {onSale ? (
                                <span className="flex items-center gap-1.5">
                                  <span className="font-medium text-rose-600">
                                    {formatPrice(effectivePrice)}
                                  </span>
                                  <span className="text-neutral-400 line-through">
                                    {formatPrice(originalPrice)}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-neutral-500">
                                  {formatPrice(effectivePrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="whitespace-nowrap text-sm font-semibold text-neutral-900">
                            {formatPrice(effectivePrice * item.quantity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="my-4 border-t border-dashed border-neutral-200" />

                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">
                    Tổng cộng
                  </span>
                  <span className="font-serif text-xl text-neutral-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={canSubmit}
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>

                <p className="mt-3 text-center text-xs text-neutral-400">
                  Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của
                  chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
