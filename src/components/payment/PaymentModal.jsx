import React, { useState } from "react";

const PaymentModal = ({
  productName = "Sản phẩm không tên",
  amount,
  fee = 0,
  total,
  qrImageUrl,
}) => {
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [finalTotal, setFinalTotal] = useState(total);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const handleApplyCoupon = () => {
    let discount = 0;

    // Giả sử nếu coupon là "GIAM10" thì giảm 10%
    if (coupon.trim().toUpperCase() === "GIAM10") {
      discount = amount * 0.1;
    }

    const updatedTotal = amount + fee - discount;
    setFinalTotal(updatedTotal);
  };

  const handleProceedPayment = () => {
    if (!email) {
      alert("Vui lòng nhập email để tiếp tục.");
      return;
    }

    setShowPaymentInfo(true);
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 mx-auto space-y-6">
      {/* Tên sản phẩm */}
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          {productName}
        </h2>
      </div>

      {/* Thông tin tiền */}
      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-800 text-sm font-medium border-b pb-3 space-y-2 sm:space-y-0">
        <p>
          Số tiền:{" "}
          <span className="font-semibold text-black">
            {Number(amount).toLocaleString("vi-VN")}đ
          </span>
        </p>
        <p>
          Phí giao dịch:{" "}
          <span className="font-semibold text-black">
            {Number(fee).toLocaleString("vi-VN")}đ
          </span>{" "}
          ({((fee / amount) * 100).toFixed(0)}%)
        </p>
        <p>
          Tổng tiền:{" "}
          <span className="font-bold text-green-600">
            {Number(finalTotal).toLocaleString("vi-VN")}đ
          </span>
        </p>
      </div>

      {/* Email & Coupon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm text-gray-700 font-medium mb-1">
            Email nhận hóa đơn <span className="text-red-500">*</span>:
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email"
            className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Coupon */}
        <div className="flex flex-col">
          <label htmlFor="coupon" className="text-sm text-gray-700 font-medium mb-1">
            Mã giảm giá:
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Nhập mã..."
              className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md whitespace-nowrap"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      {/* Nút tiến hành thanh toán */}
      <div className="text-center">
        <button
          onClick={handleProceedPayment}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium text-sm"
        >
          Tiến hành thanh toán
        </button>
      </div>

      {/* QR + hướng dẫn chỉ hiển thị khi đã nhập email */}
      {showPaymentInfo && (
        <div className="flex flex-col md:flex-row items-start justify-center gap-6 mt-6">
          {/* QR Image */}
          <div className="w-full md:w-56 aspect-square border rounded-lg overflow-hidden flex-shrink-0 mx-auto">
            <img
              src={
                qrImageUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOFQu7p46XsbV39CIHYl3swUPQfDc7HGoP6FrVBIK9rPnaAw68GgDZrbVqAtA-HfGcz4&usqp=CAU"
              }
              alt="QR code"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Hướng dẫn */}
          <div className="text-sm text-gray-700 leading-relaxed w-full">
            <p className="font-semibold text-base mb-2">
              Thực hiện theo hướng dẫn sau để thanh toán tự động:
            </p>
            <ol className="space-y-1 list-decimal pl-5 mb-4">
              <li>Mở ứng dụng <strong>Mobile Banking</strong> của ngân hàng</li>
              <li>Chọn <strong>"Thanh Toán"</strong> và quét mã QR tại hướng dẫn này</li>
              <li>Hoàn thành các bước thanh toán theo hướng dẫn và đợi hệ thống xử lý</li>
            </ol>
            <p className="text-red-600 text-sm font-medium">
              ⚠ Nếu sau 1 phút chưa thành công, vui lòng liên hệ Zalo:{" "}
              <strong>0344665098</strong> và gửi bill chuyển khoản để được hỗ trợ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModal;
