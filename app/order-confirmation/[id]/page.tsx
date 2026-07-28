// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter, useParams } from "next/navigation";

// // interface Order {
// //   _id: string;
// //   createdAt: string;
// //   totalPrice: number;
// //   status: string;
// //   products: {
// //     _id: string;
// //     product?: { name: string; images?: string[]; description?: string };
// //     variant?: { size: string; image?: string };
// //     quantity: number;
// //   }[];
// //   shippingAddress?: {
// //     fullName?: string;
// //     address?: string;
// //     city?: string;
// //     country?: string;
// //     phone?: string;
// //   };
// // }

// // const OrderDetail = () => {
// //   const router = useRouter();
// //   const { id } = useParams();
// //   const [order, setOrder] = useState<Order | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchOrder = async () => {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         setError("Vui lòng đăng nhập lại.");
// //         router.push("/login");
// //         return;
// //       }

// //       try {
// //         const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //           credentials: "include",
// //         });

// //         if (!res.ok) {
// //           const errorData = await res.json();
// //           throw new Error(errorData.error || "Không thể tải đơn hàng");
// //         }

// //         const data = await res.json();
// //         setOrder(data);
// //       } catch (err: any) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOrder();
// //   }, [id, router]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-white flex justify-center items-center">
// //         Đang tải...
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-white flex justify-center items-center text-red-600">
// //         Lỗi: {error}
// //       </div>
// //     );
// //   }

// //   if (!order) {
// //     return (
// //       <div className="min-h-screen bg-white flex justify-center items-center">
// //         Không tìm thấy đơn hàng.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white px-4 py-6">
// //       <h1 className="text-2xl font-bold mb-6">
// //         Chi tiết đơn hàng #{order._id}
// //       </h1>
// //       <div className="border rounded-lg p-4 shadow-sm">
// //         {/* Thông tin chung */}
// //         <div className="mb-4">
// //           <p>
// //             <strong>Ngày tạo:</strong>{" "}
// //             {new Date(order.createdAt).toLocaleDateString("vi-VN")}
// //           </p>
// //           <p>
// //             <strong>Tổng giá:</strong> ${order.totalPrice.toFixed(2)} USD
// //           </p>
// //           <p>
// //             <strong>Trạng thái:</strong> {order.status}
// //           </p>
// //         </div>

// //         {/* Danh sách sản phẩm */}
// //         <div className="mb-4">
// //           <h3 className="font-medium">Sản phẩm:</h3>
// //           {order.products.length > 0 ? (
// //             <ul className="list-disc pl-5">
// //               {order.products.map((item) => (
// //                 <li key={item._id} className="flex items-center mb-2">
// //                   <img
// //                     src={item.variant?.image || item.product?.images?.[0] || ""}
// //                     alt={item.product?.name || "Sản phẩm"}
// //                     className="w-16 h-16 mr-4 object-cover rounded"
// //                     onError={(e) => {
// //                       e.target.src = "/placeholder-image.jpg";
// //                     }} // Placeholder nếu lỗi
// //                   />
// //                   <div>
// //                     {item.product?.name || "Sản phẩm không xác định"} (Biến thể:{" "}
// //                     {item.variant?.size || "N/A"}, Số lượng: {item.quantity})
// //                     <br />
// //                     <small>Mô tả: {item.product?.description || "N/A"}</small>
// //                   </div>
// //                 </li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p className="text-gray-500">Chưa có sản phẩm trong đơn hàng</p>
// //           )}
// //         </div>

// //         {/* Địa chỉ giao hàng */}
// //         <div>
// //           <h3 className="font-medium">Địa chỉ giao hàng:</h3>
// //           {order.shippingAddress ? (
// //             <>
// //               <p>{order.shippingAddress.fullName || "N/A"}</p>
// //               <p>
// //                 {order.shippingAddress.address || "N/A"},{" "}
// //                 {order.shippingAddress.city || "N/A"},{" "}
// //                 {order.shippingAddress.country || "N/A"}
// //               </p>
// //               <p>SĐT: {order.shippingAddress.phone || "N/A"}</p>
// //             </>
// //           ) : (
// //             <p className="text-gray-500">Chưa có thông tin giao hàng</p>
// //           )}
// //         </div>

// //         {/* Nút quay lại */}
// //         <button
// //           onClick={() => router.back()}
// //           className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
// //         >
// //           Quay lại
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderDetail;

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter, useParams } from "next/navigation";

// interface Order {
//   _id: string;
//   createdAt: string;
//   totalPrice: number;
//   status: string;
//   products: {
//     _id: string;
//     product?: {
//       name: string;
//       images?: string[];
//       description?: string;
//     };
//     variant?: {
//       size?: string;
//       image?: string;
//     };
//     quantity: number;
//   }[];
//   shippingAddress?: {
//     fullName?: string;
//     address?: string;
//     city?: string;
//     country?: string;
//     phone?: string;
//   };
// }

// const OrderDetail = () => {
//   const router = useRouter();
//   const { id } = useParams();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Vui lòng đăng nhập lại.");
//         router.push("/login");
//         return;
//       }

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//           },
//         );

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.error || "Không thể tải đơn hàng");
//         }

//         const data = await res.json();
//         setOrder(data);
//       } catch (err: unknown) {
//         const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
//         setError(message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchOrder();
//   }, [id, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         Đang tải...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center text-red-600">
//         Lỗi: {error}
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         Không tìm thấy đơn hàng.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">
//         Chi tiết đơn hàng #{order._id}
//       </h1>

//       <div className="border rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
//         {/* Thông tin chung */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pb-6 border-b">
//           <div>
//             <p className="text-sm text-gray-500">Ngày tạo</p>
//             <p className="font-medium">
//               {new Date(order.createdAt).toLocaleDateString("vi-VN")}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Tổng giá</p>
//             <p className="font-medium">${order.totalPrice.toFixed(2)} USD</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Trạng thái</p>
//             <p
//               className={`font-medium ${
//                 order.status === "completed"
//                   ? "text-green-600"
//                   : order.status === "cancelled"
//                     ? "text-red-600"
//                     : "text-yellow-600"
//               }`}
//             >
//               {order.status}
//             </p>
//           </div>
//         </div>

//         {/* Danh sách sản phẩm */}
//         <div className="mb-8">
//           <h3 className="font-medium text-lg mb-4">Sản phẩm đã mua</h3>
//           <div className="space-y-4">
//             {order.products.length > 0 ? (
//               order.products.map((item) => {
//                 const imageSrc =
//                   item.variant?.image ||
//                   item.product?.images?.[0] ||
//                   "/placeholder-image.jpg";

//                 return (
//                   <div
//                     key={item._id}
//                     className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0"
//                   >
//                     <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border">
//                       <Image
//                         src={imageSrc}
//                         alt={item.product?.name || "Sản phẩm"}
//                         fill
//                         className="object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src =
//                             "/placeholder-image.jpg";
//                         }}
//                       />
//                     </div>

//                     <div className="flex-1">
//                       <p className="font-medium">
//                         {item.product?.name || "Sản phẩm không xác định"}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Biến thể: {item.variant?.size || "N/A"} • Số lượng:{" "}
//                         {item.quantity}
//                       </p>
//                       {item.product?.description && (
//                         <p className="text-sm text-gray-500 mt-1">
//                           {item.product.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="text-gray-500">Chưa có sản phẩm trong đơn hàng</p>
//             )}
//           </div>
//         </div>

//         {/* Địa chỉ giao hàng */}
//         <div className="mb-8">
//           <h3 className="font-medium text-lg mb-3">Địa chỉ giao hàng</h3>
//           {order.shippingAddress ? (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="font-medium">{order.shippingAddress.fullName}</p>
//               <p>{order.shippingAddress.address}</p>
//               <p>
//                 {order.shippingAddress.city}, {order.shippingAddress.country}
//               </p>
//               <p>SĐT: {order.shippingAddress.phone}</p>
//             </div>
//           ) : (
//             <p className="text-gray-500">Chưa có thông tin giao hàng</p>
//           )}
//         </div>

//         {/* Nút hành động */}
//         <button
//           onClick={() => router.back()}
//           className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors"
//         >
//           ← Quay lại
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Package } from "lucide-react";

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  products: {
    _id: string;
    product?: {
      name: string;
      images?: string[];
      description?: string;
    };
    variant?: {
      size?: string;
      image?: string;
    };
    quantity: number;
  }[];
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
  };
}

// ==================== TOKENS ====================
// Cùng hệ thống thiết kế "hoá đơn giấy" với trang xác nhận đơn hàng,
// để trải nghiệm xuyên suốt từ lúc đặt hàng đến khi xem lại chi tiết.
const receiptVars: React.CSSProperties = {
  ["--bg" as string]: "#EEF1EC",
  ["--paper" as string]: "#FFFFFF",
  ["--ink" as string]: "#1B2420",
  ["--ink-muted" as string]: "#67716C",
  ["--line" as string]: "#D7DDD3",
  ["--success" as string]: "#0E7C5A",
  ["--success-soft" as string]: "#E4F3EC",
  ["--danger" as string]: "#C23B3B",
  ["--danger-soft" as string]: "#FBEAEA",
  ["--amber-soft" as string]: "#FDF3E3",
  ["--amber" as string]: "#B8791B",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const statusChipClass: Record<string, string> = {
  pending: "bg-[var(--amber-soft)] text-[var(--amber)]",
  paid: "bg-[var(--success-soft)] text-[var(--success)]",
  shipped: "bg-blue-50 text-blue-700",
  completed: "bg-[var(--success-soft)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

// Đường xé + 2 lỗ khuyết hai mép, ngăn cách phần "cuống" thông tin chung
// với phần thân chi tiết sản phẩm — cùng mô-típ với trang xác nhận đơn hàng.
function TearLine() {
  return (
    <div className="relative h-0">
      <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-[var(--line)]" />
      <span
        className="absolute -left-[11px] -top-[11px] h-[22px] w-[22px] rounded-full"
        style={{ background: "var(--bg)" }}
      />
      <span
        className="absolute -right-[11px] -top-[11px] h-[22px] w-[22px] rounded-full"
        style={{ background: "var(--bg)" }}
      />
    </div>
  );
}

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          },
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Không thể tải đơn hàng");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ ...receiptVars, background: "var(--bg)" }}
      >
        <p className="text-sm text-[var(--ink-muted)]">Đang tải đơn hàng…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ ...receiptVars, background: "var(--bg)" }}
      >
        <div className="max-w-sm rounded-xl border border-[var(--line)] bg-[var(--paper)] px-6 py-8 text-center">
          <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm font-semibold text-[var(--ink)] underline underline-offset-4"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ ...receiptVars, background: "var(--bg)" }}
      >
        <p className="text-sm text-[var(--ink-muted)]">
          Không tìm thấy đơn hàng.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 sm:py-14"
      style={{ ...receiptVars, background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        {/* ============ CUỐNG VÉ: thông tin chung ============ */}
        <div className="rounded-t-2xl border border-b-0 border-[var(--line)] bg-[var(--paper)] px-6 pt-7 pb-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Chi tiết đơn hàng
          </p>
          <p className="mt-1 break-all font-mono text-sm font-medium text-[var(--ink)]">
            #{order._id}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[var(--ink-muted)]">Ngày đặt</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--ink-muted)]">Tổng tiền</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--ink)]">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--ink-muted)]">Trạng thái</p>
              <span
                className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  statusChipClass[order.status] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabel[order.status] || order.status}
              </span>
            </div>
          </div>
        </div>

        <TearLine />

        {/* ============ THÂN VÉ: sản phẩm + giao hàng ============ */}
        <div className="rounded-b-2xl border border-t-0 border-[var(--line)] bg-[var(--paper)] px-6 pb-7 pt-5 shadow-sm">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              <Package className="h-3.5 w-3.5" />
              Sản phẩm đã mua
            </p>

            {order.products.length > 0 ? (
              <div className="divide-y divide-[var(--line)]">
                {order.products.map((item) => {
                  const imageSrc =
                    item.variant?.image ||
                    item.product?.images?.[0] ||
                    "/placeholder-image.jpg";

                  return (
                    <div
                      key={item._id}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg)]">
                        <Image
                          src={imageSrc}
                          alt={item.product?.name || "Sản phẩm"}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          {item.product?.name || "Sản phẩm không xác định"}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                          Kích thước: {item.variant?.size || "N/A"} · Số lượng:{" "}
                          <span className="font-mono">{item.quantity}</span>
                        </p>
                        {item.product?.description && (
                          <p className="mt-1.5 line-clamp-2 text-xs text-[var(--ink-muted)]">
                            {item.product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--ink-muted)]">
                Chưa có sản phẩm trong đơn hàng
              </p>
            )}
          </div>

          {/* Tổng cộng */}
          <div className="mt-1 flex items-center justify-between border-t-2 border-[var(--ink)] pt-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
              Tổng cộng
            </span>
            <span className="font-mono text-lg font-bold text-[var(--ink)]">
              {formatPrice(order.totalPrice)}
            </span>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              Địa chỉ giao hàng
            </p>
            {order.shippingAddress ? (
              <div className="rounded-lg bg-[var(--bg)] px-4 py-3 text-sm text-[var(--ink-muted)]">
                <p className="font-semibold text-[var(--ink)]">
                  {order.shippingAddress.fullName}
                </p>
                <p className="mt-0.5">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country}
                </p>
                <p className="mt-0.5">SĐT: {order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-[var(--ink-muted)]">
                Chưa có thông tin giao hàng
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
