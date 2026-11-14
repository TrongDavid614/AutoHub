import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Accessory } from '@/types/accessory.types';
import { cartService } from '@/features/customer/services/cart.service';

export interface CartItem {
  accessory: Accessory;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  savedItems: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addToCart: (accessory: Accessory, quantity?: number, customerId?: number) => Promise<void>;
  removeFromCart: (accessoryId: number, customerId?: number) => Promise<void>;
  updateQuantity: (accessoryId: number, quantity: number, customerId?: number) => Promise<void>;
  clearCart: (customerId?: number) => Promise<void>;

  // Wishlist / Save for later
  saveForLater: (accessoryId: number) => void;
  moveToCart: (accessoryId: number, customerId?: number) => Promise<void>;
  removeSavedItem: (accessoryId: number) => void;

  // Server sync
  fetchCartFromServer: (customerId?: number) => Promise<void>;
  syncGuestCartWithServer: (customerId?: number) => Promise<void>;

  // Getters
  getTotalAmount: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      savedItems: [],
      isLoading: false,
      error: null,

      addToCart: async (accessory: Accessory, quantity = 1, customerId?: number) => {
        // 1. Cập nhật lạc quan (Optimistic update) trên giao diện
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.accessory.id === accessory.id
          );

          const maxStock = accessory.stockQuantity || 99;
          if (existingItemIndex > -1) {
            const updated = [...state.cartItems];
            const newQty = Math.min(updated[existingItemIndex].quantity + quantity, maxStock);
            updated[existingItemIndex].quantity = newQty;
            return { cartItems: updated, error: null };
          }

          const initialQty = Math.min(quantity, maxStock);
          return {
            cartItems: [...state.cartItems, { accessory, quantity: initialQty }],
            error: null,
          };
        });

        // 2. Đồng bộ ngầm lên database nếu có customerId hoặc đang online
        try {
          await cartService.addItem(accessory.id, quantity, customerId);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Không thể đồng bộ giỏ hàng với máy chủ';
          console.warn('[CartStore] Lỗi đồng bộ máy chủ khi thêm sản phẩm:', msg);
          set({ error: msg });
        }
      },

      removeFromCart: async (accessoryId: number, customerId?: number) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.accessory.id !== accessoryId),
          error: null,
        }));

        try {
          await cartService.removeItem(accessoryId, customerId);
        } catch (err) {
          console.warn('[CartStore] Lỗi khi xóa sản phẩm trên máy chủ:', err);
        }
      },

      updateQuantity: async (accessoryId: number, quantity: number, customerId?: number) => {
        if (quantity <= 0) {
          get().removeFromCart(accessoryId, customerId);
          return;
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) => {
            if (item.accessory.id === accessoryId) {
              const maxStock = item.accessory.stockQuantity || 99;
              const safeQty = Math.min(quantity, maxStock);
              return { ...item, quantity: safeQty };
            }
            return item;
          }),
          error: null,
        }));

        try {
          await cartService.updateQuantity(accessoryId, quantity, customerId);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Số lượng vượt quá tồn kho thực tế';
          set({ error: msg });
        }
      },

      clearCart: async (customerId?: number) => {
        set({ cartItems: [], error: null });
        try {
          await cartService.clearCart(customerId);
        } catch (err) {
          console.warn('[CartStore] Lỗi khi làm trống giỏ hàng trên máy chủ:', err);
        }
      },

      saveForLater: (accessoryId: number) => {
        const itemToSave = get().cartItems.find((i) => i.accessory.id === accessoryId);
        if (itemToSave) {
          set((state) => ({
            cartItems: state.cartItems.filter((i) => i.accessory.id !== accessoryId),
            savedItems: [...state.savedItems.filter((s) => s.accessory.id !== accessoryId), itemToSave],
            error: null,
          }));
        }
      },

      moveToCart: async (accessoryId: number, customerId?: number) => {
        const itemToMove = get().savedItems.find((i) => i.accessory.id === accessoryId);
        if (itemToMove) {
          set((state) => ({
            savedItems: state.savedItems.filter((s) => s.accessory.id !== accessoryId),
          }));
          await get().addToCart(itemToMove.accessory, itemToMove.quantity, customerId);
        }
      },

      removeSavedItem: (accessoryId: number) => {
        set((state) => ({
          savedItems: state.savedItems.filter((s) => s.accessory.id !== accessoryId),
        }));
      },

      fetchCartFromServer: async (customerId?: number) => {
        set({ isLoading: true, error: null });
        try {
          const data = await cartService.getCart(customerId);
          if (data && Array.isArray(data.items)) {
            const serverItems: CartItem[] = data.items.map((it) => ({
              accessory: it.accessory,
              quantity: it.quantity,
            }));
            set({ cartItems: serverItems, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          console.warn('[CartStore] Không thể tải giỏ hàng từ máy chủ:', err);
          set({ isLoading: false });
        }
      },

      syncGuestCartWithServer: async (customerId?: number) => {
        const currentItems = get().cartItems;
        if (currentItems.length === 0) {
          await get().fetchCartFromServer(customerId);
          return;
        }

        const payload = currentItems.map((ci) => ({
          accessoryId: ci.accessory.id,
          quantity: ci.quantity,
        }));

        try {
          const res = await cartService.syncGuestCart(payload, customerId);
          if (res && Array.isArray(res.items)) {
            const mergedItems: CartItem[] = res.items.map((it) => ({
              accessory: it.accessory,
              quantity: it.quantity,
            }));
            set({ cartItems: mergedItems });
          }
        } catch (err) {
          console.warn('[CartStore] Lỗi đồng bộ giỏ hàng vãng lai:', err);
        }
      },

      getTotalAmount: () => {
        return get().cartItems.reduce(
          (sum, item) =>
            sum + (item.accessory.discountPrice || item.accessory.price) * item.quantity,
          0
        );
      },

      getTotalItemsCount: () => {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'autohub_guest_cart',
      partialize: (state) => ({
        cartItems: state.cartItems,
        savedItems: state.savedItems,
      }),
    }
  )
);
