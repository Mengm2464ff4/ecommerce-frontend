import api from './axios';

export const productApi = {
  getAll: (page = 0, size = 10) =>
    api.get('/products', { params: { page, size } }),

  getById: (id) => api.get(`/products/${id}`),

  getActive: (page = 0, size = 10, sort) =>
    api.get('/products/active', { params: { page, size, sort } }),   // ✅ sort

  getByCategory: (categoryId, page = 0, size = 10) =>
    api.get(`/products/category/${categoryId}`, { params: { page, size } }),

  search: (params) =>
    api.get('/products/search', {
      params: {
        name: params.name || undefined,
        minPrice: params.minPrice || undefined,
        maxPrice: params.maxPrice || undefined,
        categoryId: params.categoryId || undefined,
        subcategory: params.subcategory || undefined,
        brand: params.brand || undefined,
        productSize: params.productSize || undefined,
        color: params.color || undefined,
        fit: params.fit || undefined,
        sort: params.sort || undefined,     // ✅ NEW
        newOnly: params.newOnly || undefined,      // ✅ NEW
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    }),

  // ADMIN — unchanged
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  activate: (id) => api.patch(`/products/${id}/activate`),
  deactivate: (id) => api.patch(`/products/${id}/deactivate`),

  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: (id) => api.delete(`/products/${id}/image`),
};