import React, { useState } from "react";

export default function OrderDetails({ order }) {
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.productAccountData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN");
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-center text-green-600 mt-6">
        Chi tiết đơn hàng
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <tbody className="divide-y divide-gray-200">
            {[
              ["Mã giao dịch", order.paymentTransactionCode],
              ["Tên sản phẩm", order.productName],
              ["Email nhận hàng", order.contactInfo],
              ["Thời gian thanh toán", formatDateTime(order.paidAt)],
              ["Ngày tạo đơn", formatDateTime(order.createAt)],
              ["Hết hạn lấy mã", formatDateTime(order.expiredAt)],
            
             ["Tổng tiền", order.totalAmount ? order.totalAmount.toLocaleString("vi-VN") + "₫" : "0₫"]

            ].map(([label, value], idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-600 w-1/3">
                  {label}
                </td>
                <td className="py-3 text-gray-900">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tài khoản sản phẩm */}
      <div className="mt-10 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-base font-semibold text-gray-700 mb-3">
          Tài khoản sản phẩm
        </h3>

        {showAccount ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="w-full flex-1 bg-white border border-gray-300 px-4 py-2 rounded-md font-mono text-sm text-gray-800 shadow-sm break-all">
              {order.productAccountData}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {copied ? "Đã copy" : "Copy"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAccount(true)}
            className="px-4 py-2 mt-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm transition font-medium"
          >
            Hiện tài khoản
          </button>
        )}

        <p className="mt-3 text-xs text-red-500 italic">
          * Định dạng: <strong>email:password</strong> – vui lòng đăng nhập đúng
          theo định dạng để tránh lỗi.
        </p>
      </div>
    </div>
  );
}
