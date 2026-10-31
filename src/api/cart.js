// import api from "./axios";

// export const cartApi = {
//   // Get current user's cart
//   getCart: () => api.get("/cart"),

//   // Get cart item count
//   getCount: () => api.get("/cart/count"),

//   // Get cart total price
//   getTotal: () => api.get("/cart/total"),

//   // Add product to cart
//   addItem: (productId, quantity = 1) =>
//     api.post("/cart/add", { productId, quantity }),

//   // Update quantity — backend expects PUT with productId in path + quantity as query
//   updateItem: (productId, quantity) =>
//     api.put(`/cart/update/${productId}`, null, {
//       params: { quantity },
//     }),

//   // Remove — backend expects DELETE with productId in path
//   removeItem: (productId) => api.delete(`/cart/remove/${productId}`),

//   // Clear cart
//   clearCart: () => api.delete("/cart/clear"),

//   // Sync (bulk add)
//   syncCart: (items) => api.post("/cart/sync", items),
// };
import api from "./axios";

export const cartApi = {
  // Get current user's cart
  getCart: () => api.get("/cart"),

  // Get cart item count
  getCount: () => api.get("/cart/count"),

  // Get cart total price
  getTotal: () => api.get("/cart/total"),

  // Add product to cart — with SIZE
  addItem: (productId, quantity = 1, size = null) =>
    api.post("/cart/add", { productId, quantity, size }),

  // Update quantity — now uses cart ITEM id (not product id)
  updateItem: (itemId, quantity) =>
    api.put(`/cart/update/${itemId}`, null, {
      params: { quantity },
    }),

  // Remove — now uses cart ITEM id
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),

  // Clear cart
  clearCart: () => api.delete("/cart/clear"),

  // Sync (bulk add)
  syncCart: (items) => api.post("/cart/sync", items),
};