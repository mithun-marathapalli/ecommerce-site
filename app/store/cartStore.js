import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (productId) => {
                const existing = get().cart.find(
                    (item) => item.id === productId
                )

                if (existing) {
                    // increase quantity)
                    set({
                        cart: get().cart.map((item) =>
                            item.id === productId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    // add new
                    set({
                        cart: [...get().cart, { id: productId, quantity: 1 }],
                    })
                }
            },

            removeItem: (id) => {
                set({
                    cart: get().cart.filter((item) => item.id !== id),
                })
            },

            updateQuantity: (productId, quantity) => {
                set({
                    cart: get().cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                })
            },

            clearCart: () => set({ cart: [] }),
        }),

        {
            name: "ecommerce_cart", // key in localStorage
            // Only persist what you need
            partialize: (state) => ({ cart: state.cart }),
        }
    )
)
