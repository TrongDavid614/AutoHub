import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Accessory } from '../types/accessory.types';

export interface CartItem {
  accessory: Accessory;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (accessory: Accessory, quantity?: number) => void;
  removeFromCart: (accessoryId: number) => void;
  updateQuantity: (accessoryId: number, quantity: number) => void;
  clearCart: () => void;
  syncGuestCartWithServer: () => Promise<void>;
  getTotalAmount: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (accessory: Accessory, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.accessory.id === accessory.id
          );
          if (existingItemIndex > -1) {
            const updated = [...state.cartItems];
            updated[existingItemIndex].quantity += quantity;
            return { cartItems: updated };
          }
          return { cartItems: [...state.cartItems, { accessory, quantity }] };
        });
      },

      removeFromCart: (accessoryId: number) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.accessory.id !== accessoryId),
        }));
      },

      updateQuantity: (accessoryId: number, quantity: number) => {
        set((state) => ({
          cartItems:
            quantity <= 0
              ? state.cartItems.filter((i) => i.accessory.id !== accessoryId)
              : state.cartItems.map((i) =>
                  i.accessory.id === accessoryId ? { ...i, quantity } : i
                ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      syncGuestCartWithServer: async () => {
        // Stub for merging local cart to server upon login
        console.log('[CartStore] Syncing local guest cart to server backend...');
      },

      getTotalAmount: () => {
        return get().cartItems.reduce(
          (sum, item) => sum + (item.accessory.discountPrice || item.accessory.price) * item.quantity,
          0
        );
      },

      getTotalItemsCount: () => {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'autohub_guest_cart',
    }
  )
);
