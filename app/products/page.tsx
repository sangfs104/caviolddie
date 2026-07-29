"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addToCart, refresh } from "../../redux/cartSlice";
import QuickViewModal, {
  QuickViewProduct,
  AddToCartPayload,
} from "../components/Quickviewmodal";
import CartToast, { CartToastItem } from "../components/Carttoast";

interface Product extends QuickViewProduct {
  image: string;
  hoverImage?: string;
  rawVariants: ApiVariant[];
  rawImages: string[];
  originalPrice: number | null;
  hasDiscount: boolean;
}

interface ApiVariant {
  _id: string;
  size: string;
  color: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  image: string;
}

interface ApiProduct {
  _id: string;
  name: string;
  images: string[];
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  variants: ApiVariant[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const variants = apiProduct.variants ?? [];

  const colorMap = new Map<string, string[]>();
  variants.forEach((v) => {
    const existing = colorMap.get(v.color) ?? [];
    if (v.image && !existing.includes(v.image)) {
      existing.push(v.image);
    }
    colorMap.set(v.color, existing);
  });

  const colors = Array.from(colorMap.entries()).map(([name, images]) => ({
    name,
    images: images.length > 0 ? images : apiProduct.images,
  }));

  const sizes = Array.from(new Set(variants.map((v) => v.size)));

  // ✅ Chọn biến thể có giá cuối cùng (discountPrice ?? price) thấp nhất
  // để làm đại diện hiển thị cho sản phẩm — đảm bảo giá gốc & giá giảm
  // luôn thuộc CÙNG một biến thể, tránh lệch dữ liệu.
  // (Dùng reduce thay vì let+forEach để tránh TS narrow sai kiểu qua closure)
  const cheapestVariant: ApiVariant | null = variants.reduce<ApiVariant | null>(
    (best, current) => {
      const currentFinal = current.discountPrice ?? current.price;
      const bestFinal = best ? (best.discountPrice ?? best.price) : Infinity;
      return currentFinal < bestFinal ? current : best;
    },
    null,
  );

  const price = cheapestVariant
    ? (cheapestVariant.discountPrice ?? cheapestVariant.price)
    : 0;

  const hasDiscount = !!(
    cheapestVariant &&
    cheapestVariant.discountPrice != null &&
    cheapestVariant.discountPrice < cheapestVariant.price
  );

  const originalPrice =
    hasDiscount && cheapestVariant ? cheapestVariant.price : null;

  const soldOut = variants.length > 0 && variants.every((v) => v.stock <= 0);

  const image = apiProduct.images?.[0] ?? variants[0]?.image ?? "";
  const hoverImage = apiProduct.images?.[1];

  return {
    id: apiProduct._id,
    name: apiProduct.name,
    image,
    hoverImage,
    price,
    originalPrice,
    hasDiscount,
    sizes,
    soldOut,
    colors,
    rawVariants: variants,
    rawImages: apiProduct.images ?? [],
  };
}

function ProductCard({
  product,
  onQuickAdd,
}: {
  product: Product;
  onQuickAdd: (product: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const sizesCount = product.sizes.length;

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ✅ Bọc Link quanh ảnh — bấm vào ảnh sẽ chuyển tới trang chi tiết */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 cursor-pointer">
          {product.soldOut && (
            <span className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white text-[11px] tracking-wide px-3 py-1">
              Hết hàng
            </span>
          )}

          {/* ✅ Badge giảm giá */}
          {!product.soldOut && product.hasDiscount && product.originalPrice && (
            <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[11px] font-medium tracking-wide px-2 py-1 rounded">
              -
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100,
              )}
              %
            </span>
          )}

          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className={`object-cover transition-opacity duration-300 ${
                product.hoverImage && hovered ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className={`object-cover transition-opacity duration-300 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </Link>

      <div className="mt-3 text-[11px] text-gray-400">
        +{sizesCount} Kích thước
      </div>

      {/* ✅ Tên sản phẩm cũng bấm vào được, đồng bộ trải nghiệm */}
      <Link href={`/products/${product.id}`}>
        <h3 className="mt-1 text-sm font-medium text-gray-900 uppercase hover:underline">
          {product.name}
        </h3>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        {/* ✅ Giá: nếu có giảm giá -> giá gốc gạch ngang (xám) + giá giảm (đỏ) */}
        <div className="flex items-baseline gap-2">
          {product.soldOut ? (
            <span className="text-sm text-gray-400">Hết hàng</span>
          ) : product.hasDiscount && product.originalPrice ? (
            <>
              <span className="text-sm font-semibold text-red-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // ✅ Ngăn không cho nổi bọt lên Link cha
            onQuickAdd(product);
          }}
          disabled={product.soldOut}
          className={`flex items-center gap-1.5 rounded-full pl-3 pr-1 py-1 text-[11px] tracking-wide transition-colors ${
            product.soldOut
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-white text-gray-900 hover:bg-gray-900 hover:text-white"
          }`}
        >
          {!product.soldOut && <span>THÊM VÀO GIỎ</span>}
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-full ${
              product.soldOut
                ? "bg-gray-200"
                : "bg-gray-900 group-hover:bg-white"
            }`}
          >
            <ShoppingBag
              size={13}
              className={
                product.soldOut
                  ? "text-gray-400"
                  : "text-white group-hover:text-gray-900"
              }
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const [quickViewProduct, setQuickViewProduct] =
    useState<QuickViewProduct | null>(null);
  const [toastItem, setToastItem] = useState<CartToastItem | null>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const getUserId = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.id) return userData.id;
      }
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }
      return guestId;
    }
    return "";
  };

  useEffect(() => {
    const mergeCart = async () => {
      if (!user?.id) return;
      const guestId = localStorage.getItem("guestId");
      if (guestId && guestId !== user.id) {
        try {
          const response = await fetch(`${API_URL}/api/cart/merge`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ guestId, userId: user.id }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Lỗi khi hợp nhất giỏ hàng");
          }
          localStorage.removeItem("guestId");
          dispatch(refresh());
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Lỗi không xác định";
          console.error("Lỗi hợp nhất giỏ hàng:", message);
          setError(message);
        }
      }
    };
    mergeCart();
  }, [user?.id, dispatch]);

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Lỗi API: ${res.status}`);
        }

        const data: ApiProduct[] = await res.json();

        if (!ignore) {
          setProducts(data.map(mapApiProductToProduct));
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const handleConfirmAddToCart = async (payload: AddToCartPayload) => {
    const product = products.find((p) => p.id === payload.product.id);
    if (!product) {
      setError("Không tìm thấy sản phẩm");
      return;
    }

    const selectedVariant = product.rawVariants.find(
      (v) => v.color === payload.color && v.size === payload.size,
    );

    if (!selectedVariant) {
      setError("Không tìm thấy biến thể phù hợp (size/màu)");
      return;
    }

    if (payload.quantity > selectedVariant.stock) {
      setError("Số lượng vượt quá tồn kho!");
      return;
    }

    setAddingToCart(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = getUserId();
      if (!userId) throw new Error("Không tìm thấy userId");

      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          productId: product.id,
          variantId: selectedVariant._id,
          quantity: payload.quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể thêm vào giỏ hàng");
      }

      dispatch(
        addToCart({
          product: {
            _id: product.id,
            name: product.name,
            price: product.price,
            images: product.rawImages ?? [],
          },
          variant: {
            ...selectedVariant,
            discountPrice: selectedVariant.discountPrice ?? undefined,
          },
          quantity: payload.quantity,
        }),
      );

      window.dispatchEvent(new Event("cart-updated"));

      setQuickViewProduct(null);
      setToastItem({
        name: payload.product.name,
        price: payload.product.price * payload.quantity,
        image: payload.image,
      });
      setSuccess("Đã thêm sản phẩm vào giỏ hàng!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
      console.error("Lỗi thêm vào giỏ:", err);
      setError(message);
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const updateCart = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const res = await fetch(`${API_URL}/api/cart/${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Không thể tải giỏ hàng");

        const data = await res.json();
        data.items?.forEach((item: any) => {
          dispatch(
            addToCart({
              product: {
                ...item.product,
                images: item.product.images ?? [],
              },
              variant: item.variant,
              quantity: item.quantity,
            }),
          );
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi cập nhật giỏ hàng";
        console.error(message);
        setError(message);
      }
    };

    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, [dispatch]);

  if (loading) {
    return (
      <main className="px-4 sm:px-8 md:px-12 py-10 text-center text-gray-500">
        Đang tải sản phẩm...
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="px-4 sm:px-8 md:px-12 py-10 text-center text-red-500">
        {error}
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-8 md:px-12 py-10">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-6xl mx-auto justify-items-center">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickAdd={setQuickViewProduct}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onConfirm={handleConfirmAddToCart}
      />

      <CartToast item={toastItem} onClose={() => setToastItem(null)} />
    </main>
  );
}
