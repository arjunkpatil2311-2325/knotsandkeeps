import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; // product id
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  image_url?: string;
  quantity: number;
  stock_quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        if (existingItem) {
          // If already in cart, just increase quantity (checking stock limit)
          const updatedQuantity = Math.min(existingItem.quantity + newItem.quantity, newItem.stock_quantity);
          return {
            items: state.items.map(item => 
              item.id === newItem.id 
                ? { ...item, quantity: updatedQuantity } 
                : item
            )
          };
        } else {
          return { items: [...state.items, newItem] };
        }
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => {
          if (item.id === id) {
             // Ensure we don't exceed stock
             const safeQuantity = Math.max(1, Math.min(quantity, item.stock_quantity));
             return { ...item, quantity: safeQuantity };
          }
          return item;
        })
      })),

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'knots-and-keeps-cart', // name of the item in the storage (must be unique)
    }
  )
)
