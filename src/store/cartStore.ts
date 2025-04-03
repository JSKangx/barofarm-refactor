import { CartItems } from "type/cart";
import { create } from "zustand";

// Cart 아이템 타입 정의
interface CartInfo {
  items: CartItems[];
  totalFees: number;
  totalShippingFees: number;
  previousUrl: string;
}

// CartStore 타입 정의
export interface CartStore {
  cart: CartInfo | null;
  setCart: (cartInfo: CartInfo) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  setCart: (cartInfo) => set({ cart: cartInfo }),
}));
