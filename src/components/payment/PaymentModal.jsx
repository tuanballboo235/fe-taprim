import React from "react";

const PaymentModal = ({ amount, fee = 0, total, qrImageUrl }) => {
  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 mx-auto space-y-6">
      {/* Thông tin tiền */}
      <div className="flex justify-between text-gray-800 text-sm font-medium border-b pb-2">
        <p>
          Số tiền:{" "}
          <span className="font-semibold text-black"> 
            {Number(amount).toLocaleString("vi-VN")}
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
            {Number(total).toLocaleString("vi-VN")}đ
          </span>
        </p>
      </div>

      {/* QR + hướng dẫn */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 mt-4">
        {/* QR Image */}
        <div className="w-56 aspect-square border rounded-lg overflow-hidden flex-shrink-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOFQu7p46XsbV39CIHYl3swUPQfDc7HGoP6FrVBIK9rPnaAw68GgDZrbVqAtA-HfGcz4&usqp=CAU"
            alt="QR code"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Hướng dẫn thanh toán */}
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold text-base mb-2">
            Thực hiện theo hướng dẫn sau để thanh toán:
          </p>
          <ol className="space-y-1 list-decimal pl-5 mb-4">
            <li>
              Mở ứng dụng <strong>Mobile Banking</strong> của ngân hàng
            </li>
            <li>
              Chọn <strong>"Thanh Toán"</strong> và quét mã QR tại hướng dẫn này
            </li>
            <li>
              Hoàn thành các bước thanh toán theo hướng dẫn và đợi hệ thống xử
              lý
            </li>
          </ol>

          {/* Lưu ý màu đỏ */}
          <p className="text-red-600 text-sm font-medium"> 
            ⚠ Trong trường hợp đợi quá 1 phút nhưng không thành công, hãy liên
            hệ Zalo: <strong>0344665098</strong> và gửi bill chuyển khoản để
            được hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
