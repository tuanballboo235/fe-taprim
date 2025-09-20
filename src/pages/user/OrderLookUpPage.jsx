import React, { useState } from "react";
import OrderDetails from "../../components/user/order/OrderDetails";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Tra cứu đơn hàng
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-8">
        <input
          type="text"
          placeholder="Nhập mã giao dịch (ví dụ: TAPR123456)"
          value={transactionInput}
          onChange={(e) => setTransactionInput(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang tra cứu..." : "Tra cứu"}
        </button>
      </div>

      {orderData && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <OrderDetails order={orderData.data} />
        </div>
      )}
    </div>
  );
}
