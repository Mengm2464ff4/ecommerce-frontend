// import api from "./axios";

// export const paymentApi = {
//     // Create a Stripe Checkout session for an order
//     createCheckoutSession: (orderId) =>
//         api.post('/api/payments/checkout', { orderId }),

//     // Confirm payment after Stripe redirect
//     confirmPayment: (sessionId) =>
//         api.post('/api/payments/confirm', { sessionId }),

//     //Get payment details for an order
//     getPaymentByOrderId: (orderId) => 
//         api.get(`/api/payments/order/${orderId}`),

//     // Admin: refund a payment
//     refund: (paymentId) => api.post(`/api/payments/refund/${paymentId}`),
// }

// import api from "./axios";
import api from "../api/axios"; // 👈 Use your configured instance

export const paymentApi = {
  // Create a Stripe Checkout session for an order
  createCheckoutSession: (orderId) =>
    api.post("/payments/checkout", { orderId }),

  // Confirm payment after Stripe redirect
  confirmPayment: (sessionId) =>
    api.post("/payments/confirm", { sessionId }),

  // Get payment details for an order
  getPaymentByOrderId: (orderId) =>
    api.get(`/payments/order/${orderId}`),

  // Admin: refund a payment
  refund: (paymentId) => api.post(`/payments/refund/${paymentId}`),
};