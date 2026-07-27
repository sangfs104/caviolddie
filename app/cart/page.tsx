"use client";

import { useState, useEffect, useCallback } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
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
// ✅ Đồng bộ logic với ProductDetail.tsx: force https + thêm /api nếu thiếu
// const getImageUrl = (imgPath?: string): string => {
//   if (!imgPath) return "/img/placeholder.jpg";

//   if (imgPath.startsWith("http")) {
//     // Force https
//     let url = imgPath.replace(/^http:\/\//, "https://");
//     // Thêm /api nếu thiếu (đường dẫn ảnh backend dạng /api/products/images/...)
//     url = url.replace(/(https:\/\/[^/]+)(\/products\/images\/)/, "$1/api$2");
//     return url;
//   }

//   return `${process.env.NEXT_PUBLIC_API_URL}${
//     imgPath.startsWith("/") ? "" : "/"
//   }${imgPath}`;
// };
const getImageUrl = (imgPath?: string): string => {
  if (!imgPath) return "/img/placeholder.jpg";
  if (imgPath.startsWith("http")) {
    return imgPath.replace(/^http:\/\//, "https://");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${
    imgPath.startsWith("/") ? "" : "/"
  }${imgPath}`;
};
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

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

  const handleCheckout = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6 md:py-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Giỏ hàng của bạn</h1>
          <Link
            href="/products"
            className="text-xs sm:text-sm underline hover:no-underline"
          >
            Tiếp tục mua sắm
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-base sm:text-lg">
              Giỏ hàng của bạn đang trống
            </p>
          </div>
        ) : (
          <>
            {/* Header Table */}
            <div className="grid grid-cols-12 gap-4 pb-3 sm:pb-4 border-b border-gray-200 text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
              <div className="col-span-6">SẢN PHẨM</div>
              <div className="col-span-3 text-center">SỐ LƯỢNG</div>
              <div className="col-span-3 text-right">TỔNG</div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
              {cartItems.map((item) => {
                const effectivePrice = getEffectivePrice(item);
                const originalPrice = item.variant?.price || 0;
                const isOnSale =
                  item.variant?.discountPrice &&
                  item.variant.discountPrice < item.variant.price;

                return (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-6 flex items-center space-x-3 sm:space-x-4">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                        <h3 className="font-medium text-xs sm:text-sm uppercase mb-1">
                          {item.product?.name || "Không có tên"}
                        </h3>
                        <div className="text-gray-600 text-xs sm:text-sm">
                          {isOnSale ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-red-500">
                                {formatPrice(effectivePrice)}
                              </span>
                              <span className="line-through text-gray-400">
                                {formatPrice(originalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span>{formatPrice(effectivePrice)}</span>
                          )}
                        </div>
                        {item.variant && (
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Kích thước: {item.variant.size}, Màu sắc:{" "}
                            {item.variant.color}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-center">
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
                          className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                          disabled={
                            item.quantity === 1 || updating === item._id
                          }
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-gray-300 min-w-[50px] sm:min-w-[60px] text-center text-xs sm:text-sm">
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
                          className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                          disabled={updating === item._id}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(
                            item._id,
                            item.product._id,
                            item.variant?._id,
                          )
                        }
                        className="ml-2 sm:ml-3 p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                        disabled={updating === item._id}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="font-medium text-base sm:text-lg">
                        {formatPrice(effectivePrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="flex justify-end">
                <div className="w-full max-w-md space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center text-base sm:text-lg">
                    <span className="font-medium">Tổng ước tính</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Thuế, chiết khấu và{" "}
                    <span className="underline">phí vận chuyển</span> được tính
                    khi thanh toán
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 sm:py-4 px-4 sm:px-6 rounded-md font-medium hover:bg-gray-800 transition-colors text-xs sm:text-sm block text-center"
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
