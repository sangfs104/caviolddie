// redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Product interface khớp hoàn toàn với ProductDetail.tsx
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug?: string;
  category?: { name: string }; // ← đổi từ string thành object để khớp với component
  variants?: Variant[];
  description?: string;
  createdAt?: string;
}

interface Variant {
  _id: string;
  size?: string;
  color?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  stock?: number;
}

interface CartItem {
  product: Product;
  variant: Variant | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const { product, variant, quantity } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.product._id === product._id &&
          (!variant || item.variant?._id === variant._id)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, variant, quantity });
      }
    },

    refresh(state) {
      state.items = [];
    },

    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>
    ) {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.product._id === productId &&
            (!variantId || item.variant?._id === variantId)
          )
      );
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        variantId?: string;
        quantity: number;
      }>
    ) {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) =>
          i.product._id === productId &&
          (!variantId || i.variant?._id === variantId)
      );
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, refresh, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;