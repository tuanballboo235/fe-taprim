import React, { useState } from "react";

export default function OrderAccount({ order }) {
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.productAccountData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-center text-green-600">
        Thanh toán thành công!
      </h2>

      <div>
        <p className="text-gray-600 font-medium">Mã giao dịch:</p>
        <p className="text-black">{order.paymentTransactionCode}</p>
      </div>

      <div>
        <p className="text-gray-600 font-medium">Tên sản phẩm:</p>
        <p className="text-black">{order.productName}</p>
      </div>

      <div>
        <p className="text-gray-600 font-medium">Tài khoản sản phẩm:</p>
        {showAccount ? (
          <div className="flex items-center justify-between">
            <span className="text-black break-all">{order.productAccountData}</span>
            <button
              onClick={handleCopy}
              className="ml-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {copied ? "Đã copy" : "Copy"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAccount(true)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Hiện tài khoản
          </button>
        )}
      </div>
    </div>
  );
}
