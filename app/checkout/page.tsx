"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ==================== TYPES ====================

interface Variant {
  _id: string;
  size?: string;
  color?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  stock?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
}

interface CartItem {
  _id: string;
  product: Product;
  variant?: Variant;
  quantity: number;
}

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

// ==================== HELPERS ====================

const getUserId = () => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.id) return user.id;
    return localStorage.getItem("guestId") || "";
  }
  return "";
};

const getEffectivePrice = (item: CartItem): number => {
  if (
    item.variant?.discountPrice &&
    item.variant.discountPrice < item.variant.price
  ) {
    return item.variant.discountPrice;
  }
  if (item.variant?.price) return item.variant.price;
  if (
    item.product?.discountPrice &&
    item.product.discountPrice < item.product.price
  ) {
    return item.product.discountPrice;
  }
  return item.product?.price ?? 0;
};

const getOriginalPrice = (item: CartItem): number =>
  item.variant?.price ?? item.product?.price ?? 0;

const isOnSale = (item: CartItem): boolean =>
  !!(
    item.variant?.discountPrice &&
    item.variant.discountPrice < item.variant.price
  ) ||
  !!(
    item.product?.discountPrice &&
    item.product.discountPrice < item.product.price
  );

// ==================== COMPONENT ====================

const CheckoutPage = () => {
  const router = useRouter();
  const userId = getUserId();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  useEffect(() => {
    // Bắt đăng nhập trước khi vào trang thanh toán
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const fetchCart = async () => {
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
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
        );
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          },
        );
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
        }
        const data: Address[] = await res.json();
        setAddresses(data);
        const defaultAddress = data.find((addr) => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [userId, router]);

  const subtotal = cartItems.reduce(
    (total, item) => total + getEffectivePrice(item) * item.quantity,
    0,
  );

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
    if (!token) {
      router.push("/login?redirect=/checkout");
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Thanh toán thất bại");
      }

      const createdOrder = await res.json();

      // Xóa giỏ hàng phía client (giỏ hàng thật đã được xử lý ở backend nếu có logic riêng)
      window.dispatchEvent(new Event("cart-updated"));

      router.push(`/order-confirmation?orderId=${createdOrder._id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thanh toán</h1>

        {/* Giỏ hàng */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Giỏ hàng của bạn
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Giỏ hàng trống.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const effectivePrice = getEffectivePrice(item);
                const originalPrice = getOriginalPrice(item);
                const onSale = isOnSale(item);

                return (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 border-b pb-3"
                  >
                    <Image
                      src={
                        item.variant?.image ||
                        item.product?.images?.[0] ||
                        "/img/placeholder.jpg"
                      }
                      alt={item.product?.name || "Sản phẩm"}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{item.product?.name}</div>
                      {item.variant && (
                        <div className="text-xs text-gray-500">
                          Kích thước: {item.variant.size} / Màu sắc:{" "}
                          {item.variant.color}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Số lượng: {item.quantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {onSale ? (
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
                    </div>
                    <div className="font-semibold">
                      {formatPrice(effectivePrice * item.quantity)}
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between font-semibold mt-4">
                <span>Tổng cộng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Địa chỉ giao hàng
          </h2>
          {addresses.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Chọn địa chỉ có sẵn:</h3>
              {addresses.map((addr) => (
                <div key={addr._id} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => {
                      setSelectedAddress(addr._id);
                      setUseNewAddress(false);
                    }}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold">{addr.fullName}</p>
                    <p>
                      {addr.address}, {addr.city}, {addr.country}
                    </p>
                    <p>SĐT: {addr.phone}</p>
                    {addr.isDefault && (
                      <span className="text-green-600 text-xs">[Mặc định]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useNewAddress}
                onChange={() => setUseNewAddress(!useNewAddress)}
                className="mr-2"
              />
              Nhập địa chỉ mới
            </label>
          </div>

          {useNewAddress && (
            <div className="space-y-4">
              {(
                ["fullName", "phone", "address", "city", "country"] as const
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
                  className="w-full border rounded px-3 py-2"
                />
              ))}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleNewAddressChange}
                  className="mr-2"
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Phương thức thanh toán
          </h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="mr-2"
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
                className="mr-2"
              />
              Chuyển khoản ngân hàng
            </label>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              submitting ||
              cartItems.length === 0 ||
              (!selectedAddress && !useNewAddress)
            }
          >
            {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
