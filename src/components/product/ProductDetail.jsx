import React from "react";

const ProductDetail = () => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      {/* Left: Image */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <img
          src="https://exitlag.com/assets/images/logo-exitlag.png"
          alt="ExitLag"
          className="max-h-32 object-contain"
        />
      </div>

      {/* Right: Product Info */}
      <div className="md:w-1/2 p-6 space-y-4 text-gray-800">
        {/* Title + Price */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            ExitLag 1 tháng - Code gia hạn
          </h2>
          <div className="mt-1">
            <span className="text-2xl font-bold text-red-500">99.000 ₫</span>
          </div>
        </div>

        {/* Info list */}
        <ul className="text-sm text-gray-700 space-y-1 border-t pt-3">
          <li>
            <span className="font-medium text-gray-600">Tình trạng:</span>{" "}
            <span className="text-green-600 font-semibold">Còn hàng</span>
          </li>
          <li>
            <span className="font-medium text-gray-600">Mã sản phẩm:</span>{" "}
            <span className="text-gray-900">exitlag-1m</span>
          </li>
        </ul>

        {/* Quantity + Button */}
        <div className="flex items-center gap-3 pt-4">
          <input
            type="number"
            defaultValue={1}
            min={1}
            className="w-16 text-center border border-gray-300 rounded-md py-1 text-sm text-gray-800"
          />
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 text-sm rounded-md transition">
            MUA TÀI KHOẢN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
