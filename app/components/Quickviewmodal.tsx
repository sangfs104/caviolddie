"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

export interface ProductColor {
  name: string;
  images: string[];
}

export interface QuickViewProduct {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  colors: ProductColor[];
  soldOut?: boolean;
}

export interface AddToCartPayload {
  product: QuickViewProduct;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
  onConfirm: (payload: AddToCartPayload) => void;
}

const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function QuickViewModal({
  product,
  onClose,
  onConfirm,
}: QuickViewModalProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Reset lựa chọn mỗi khi mở sản phẩm mới
  useEffect(() => {
    if (product) {
      setColorIndex(0);
      setImageIndex(0);
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [product?.id]);

  if (!product) return null;

  const currentColor = product.colors[colorIndex];
  const images = currentColor?.images ?? [];
  const currentImage = images[imageIndex] ?? images[0];

  const goPrev = () =>
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setImageIndex((prev) => (prev + 1) % images.length);

  const handleAddToCart = () => {
    if (product.soldOut || !selectedSize) return;
    onConfirm({
      product,
      color: currentColor.name,
      size: selectedSize,
      quantity,
      image: currentImage,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white grid grid-cols-1 md:grid-cols-2 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-10"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        {/* Ảnh sản phẩm */}
        <div className="p-6 md:p-8">
          <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
            {currentImage && (
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 400px"
                className="object-cover"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1"
                  aria-label="Ảnh sau"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails theo từng màu */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.colors.map((color, cIdx) =>
              color.images.map((img, iIdx) => (
                <button
                  key={`${color.name}-${iIdx}`}
                  type="button"
                  onClick={() => {
                    setColorIndex(cIdx);
                    setImageIndex(iIdx);
                  }}
                  className={`relative w-14 h-14 border overflow-hidden ${
                    cIdx === colorIndex && iIdx === imageIndex
                      ? "border-gray-900"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={color.name}
                    fill
                    className="object-cover"
                  />
                </button>
              )),
            )}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="p-6 md:p-8 md:pl-0 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 uppercase pr-8">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tình trạng:{" "}
            <span
              className={
                product.soldOut
                  ? "text-red-500 font-medium"
                  : "text-gray-900 font-medium"
              }
            >
              {product.soldOut ? "Hết hàng" : "Còn hàng"}
            </span>
          </p>

          <div className="mt-4">
            <span className="text-sm text-gray-500 block mb-1">Giá:</span>
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Màu sắc */}
          <div className="mt-5">
            <span className="text-sm text-gray-500 block mb-2">
              Màu sắc:{" "}
              <span className="text-gray-900 font-medium">
                {currentColor?.name}
              </span>
            </span>
            <div className="flex gap-2">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    setColorIndex(idx);
                    setImageIndex(0);
                  }}
                  className={`px-4 py-2 text-xs font-medium border tracking-wide ${
                    idx === colorIndex
                      ? "border-gray-900 text-gray-900"
                      : "border-gray-300 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div className="mt-5">
            <span className="text-sm text-gray-500 block mb-2">
              Kích thước:
            </span>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] px-3 py-2 text-xs font-medium border ${
                    selectedSize === size
                      ? "border-gray-900 text-gray-900"
                      : "border-gray-300 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="mt-5">
            <span className="text-sm text-gray-500 block mb-2">Số lượng:</span>
            <div className="inline-flex items-center border border-gray-300">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                aria-label="Giảm số lượng"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                aria-label="Tăng số lượng"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Thêm vào giỏ */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.soldOut || !selectedSize}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 text-white text-sm font-semibold tracking-wide py-3"
          >
            THÊM VÀO GIỎ
          </button>

          {!selectedSize && !product.soldOut && (
            <p className="mt-2 text-xs text-gray-400">
              Vui lòng chọn kích thước trước khi thêm vào giỏ.
            </p>
          )}

          <Link
            href={`/products/${product.id}`}
            className="mt-4 text-xs text-gray-500 underline hover:text-gray-900"
          >
            Xem chi tiết sản phẩm »
          </Link>
        </div>
      </div>
    </div>
  );
}
