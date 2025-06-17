import React, { useState } from "react";
import { createQrPayment } from "../../services/api/paymentService";
const PaymentModal = ({ productId, productName, amount, fee, total }) => {
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [finalTotal, setFinalTotal] = useState(total);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const clientNote = "Thanh toán sản phẩm TAPRIM";
  const handleApplyCoupon = () => {
    let discount = 0;

    // Giả sử nếu coupon là "GIAM10" thì giảm 10%
    if (coupon.trim().toUpperCase() === "GIAM10") {
      discount = amount * 0.1;
    }

    const updatedTotal = amount + fee - discount;
    setFinalTotal(updatedTotal);
  };
const handleProceedPayment = async () => {
  if (!email || !email.includes("@")) {
    alert("Vui lòng nhập email hợp lệ để tiếp tục.");
    return;
  }

  // ✅ In ra dữ liệu trước khi gọi API
  console.log("📦 Gửi thông tin tạo QR:", {
    productId,
    finalTotal,
    email,
    clientNote
  });

  try {
    const response = await createQrPayment(
      productId,
      finalTotal,
      email,
      clientNote
    );
    console.log("✅ QR thanh toán đã được tạo:", response);

    if (response.data && response.data.qrCode) {
      setQrImage(response.data.qrCode);
      setShowPaymentInfo(true);
    } else {
      alert("Không nhận được mã QR từ hệ thống.");
    }
  } catch (error) {
    console.error("❌ Lỗi khi tạo QR thanh toán:", error);
    alert("Không thể tạo mã QR. Vui lòng thử lại sau.");
  }
};


  return (
    <div className="max-w-xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 mx-auto space-y-6 max-h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-sm text-gray-700 font-medium mb-1"
          >
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
          <label
            htmlFor="coupon"
            className="text-sm text-gray-700 font-medium mb-1"
          >
            Mã giảm giá:
          </label>
          <div
            className="flex gap-1
          "
          >
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

      <div className="bg-gray-50 p-4 rounded-md border space-y-3 text-sm text-gray-800">
        {/* Tên sản phẩm */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            {productName}
          </h2>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Giá sản phẩm:</span>
          <span className="font-semibold text-black">
            {Number(amount).toLocaleString("vi-VN")}₫
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Tiền giảm giá: </span>
          <span className="font-semibold text-black">
            0₫
            <span className="text-gray-500 text-xs ml-1"></span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Phí giao dịch:</span>
          <span className="font-semibold text-black">
            {Number(fee).toLocaleString("vi-VN")}₫
            <span className="text-gray-500 text-xs ml-1"></span>
          </span>
        </div>

        <div className="border-t pt-3 flex justify-between text-base font-semibold">
          <span>Tổng thanh toán:</span>
          <span className="text-green-600 text-lg font-bold">
            {Number(finalTotal).toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* Email & Coupon */}

      {!showPaymentInfo && (
        <div className="flex flex-col text-center">
          <p className="text-sm text-red-600">
            * Vui lòng nhập email trước khi thanh toán, shop sẽ gửi thông báo
            trong trường hợp bảo hành hoặc cập nhật thông tin tài khoản tới
            email này
          </p>
        </div>
      )}

      {/* Nút tiến hành thanh toán */}
      <div className="text-center">
        <button
          onClick={handleProceedPayment}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium text-sm"
        >
          Tiến hành thanh toán
        </button>
      </div>

      {showPaymentInfo && (
        <div className="flex flex-col gap-6 mt-6 md:flex-row md:items-start md:justify-center">
          {/* QR Image */}
          <div className="w-full max-w-[280px] mx-auto md:mx-0 md:w-56 aspect-square border rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={qrImage} 
              alt="QR code"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Hướng dẫn */}
          <div className="text-sm text-gray-700 leading-relaxed w-full">
            <p className="font-semibold text-base mb-2 text-center md:text-left">
              Thực hiện theo hướng dẫn sau để thanh toán tự động:
            </p>
            <ol className="space-y-1 list-decimal pl-5 mb-4">
              <li>
                Mở ứng dụng <strong>Mobile Banking</strong> của ngân hàng
              </li>
              <li>
                Chọn <strong>"Thanh Toán"</strong> và quét mã QR bên trái và
                thanh toán
              </li>
              <li>
                Giữ màn hình 10-20s để hệ thống xác nhận thanh toán và gửi tài
                khoản qua email bạn đã nhập
              </li>
            </ol>
            <p className="text-red-600 text-sm font-medium text-center md:text-left">
              ⚠ Nếu sau 1 phút thanh toán nhưng không nhận tài khoản, vui lòng
              liên hệ Zalo: <strong>0344665098</strong> và gửi bill chuyển khoản
              để được hỗ trợ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModal;
