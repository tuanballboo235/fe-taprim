import React, { useState } from "react";
import OrderDetails from "../../components/order/OrderDetails";
import { getOrderByTransactionCode } from "../../services/api/orderService";

export default function OrderLookup() {
  const [orderData, setOrderData] = useState(null);
  const [transactionInput, setTransactionInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!transactionInput.trim()) {
      alert("Vui lòng nhập mã giao dịch!");
      return;
    }

    try {
      setLoading(true);
      const data = await getOrderByTransactionCode(transactionInput.trim());

      // Nếu không tìm thấy đơn hàng
      if (!data.data || !data.data.paymentTransactionCode) {
        alert("Không tìm thấy đơn hàng với mã giao dịch này.");
        setOrderData(null);
        return;
      }

      setOrderData(data);
    } catch (err) {
      console.error("Lỗi khi gọi API!", err);
      alert("Có lỗi xảy ra khi tra cứu đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Tra cứu đơn hàng
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Nhập mã giao dịch (ví dụ: TAPR123456)"
          value={transactionInput}
          onChange={(e) => setTransactionInput(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Đang tra cứu..." : "Tra cứu"}
        </button>
      </div>

      {/* Hiển thị kết quả nếu có */}
      {orderData && <OrderDetails order={orderData.data} />}
    </div>
  );
}
