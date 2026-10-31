import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios"; 
import { orderApi } from "../api/order"; // 👈 Imported your order API
import { QRCodeSVG } from "qrcode.react";
import { Loader2, CheckCircle2, Smartphone } from "lucide-react";

export default function Payment() {
  const { orderId } = useParams(); 
  const navigate = useNavigate();
  
  const [qrString, setQrString] = useState("");
  const [orderTotal, setOrderTotal] = useState(null); // 👈 NEW: Store the amount
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        console.log("Fetching QR for orderId:", orderId); 
        
        // 1. Fetch the order details to get the TOTAL AMOUNT
        const orderRes = await orderApi.getOrderById(orderId);
        const orderData = orderRes?.data?.data || orderRes?.data;
        setOrderTotal(orderData?.totalAmount); // 👈 Save the amount

        // 2. Generate the KHQR code
        const response = await api.post(`/orders/${orderId}/pay`);
        setQrString(response.data.data.qr); 
        
      } catch (err) {
        console.error("QR Fetch Error:", err);
        setError("Failed to generate QR code. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchPaymentData();
    }
  }, [orderId]);

  const handleMobilePay = () => {
    const abaDeepLink = `abamobilebank://ababank.com?type=payway&qrcode=${encodeURIComponent(qrString)}`; 
    window.location.href = abaDeepLink;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Scan to Pay</h2>
        <p className="text-gray-500 mb-6">Open ABA Mobile or Bakong App</p>

        {/* 👈 NEW: THE AMOUNT BALANCE DISPLAY */}
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm font-medium text-blue-600 mb-1">Total Amount</p>
          <p className="text-4xl font-black text-blue-700">
            ${orderTotal ? Number(orderTotal).toFixed(2) : "0.00"}
          </p>
        </div>

        <div className="flex justify-center p-4 bg-white border-2 border-gray-100 rounded-xl mb-6">
          <QRCodeSVG value={qrString} size={220} level={"H"} />
        </div>

        {isMobile && (
          <button
            onClick={handleMobilePay}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
          >
            <Smartphone className="w-5 h-5" />
            Pay with ABA App
          </button>
        )}

        <div className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Waiting for payment confirmation...
        </div>

        <button
          onClick={() => {
            window.location.href = "/profile"; 
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          I have paid / Go to Profile
        </button>
      </div>
    </div>
  );
}