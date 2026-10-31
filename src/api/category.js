import api from "./axios";

export const categoryApi = {
  getAll: () => api.get("/categories/all"),                    // ✅ removed /api
  getById: (id) => api.get(`/categories/${id}`),                // ✅
  create: (data) => api.post("/categories", data),              // ✅
  update: (id, data) => api.put(`/categories/${id}`, data),     // ✅
  remove: (id) => api.delete(`/categories/${id}`),              // ✅
};