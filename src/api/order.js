import api from "./axios";

export const orderApi = {
  // ==================== USER ====================

  createOrder: (data) => {
    return api.post("/orders", data);
  },

  getMyOrders: (page = 0, size = 50) => {
    return api.get("/orders", {
      params: { page, size },
    });
  },

  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },

  downloadInvoicePdf: (orderId) => {
    return api.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });
  },

  cancelOrder: (id) => {
    return api.patch(`/orders/${id}/cancel`);
  },

  // ==================== ADMIN ====================

  getAllOrders: (page = 0, size = 10) => {
    return api.get("/orders/admin/all", {
      params: { page, size },
    });
  },

  updateOrderStatus: (id, status) => {
    return api.put(`/orders/${id}/status`, null, {
      params: { status },
    });
  },
};