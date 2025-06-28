import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "Canva Pro 1 năm - Gia hạn chính chủ",
    code: "acc canva-1y",
    tags: "App, Làm việc, Thiết kế, Edit Ảnh Video",
    price: 295000,
    originalPrice: 1500000,
    discountPercent: 80,
    inStock: true,
    durations: [
      "TK 1 Tháng",
      "GH 1 tháng",
      "GH 1 Năm",
      "Nhóm 3TV - 1 tháng",
      "Nhóm 5TV - 1 tháng",
      "Nhóm 10TV - 1 tháng",
    ],
    image: "/images/canva-pro-banner.jpg", // thay bằng ảnh thực tế
    note: `
- Sản phẩm chỉ có thể gia hạn khi tài khoản không còn là tài khoản Pro.
- Sau khi hết 1 năm, đội nhóm cũ sẽ không còn gói cước và không thể thêm thành viên trở lại, bạn vui lòng backup dữ liệu thiết kế trước khi hết hạn gói nâng cấp.
- Vui lòng back-up các thiết kế trong team Canva về kho thiết kế Canva cá nhân của bạn để tránh mất dữ liệu. Divine Shop không bảo hành dữ liệu thiết kế trong team.
- Sản phẩm KHÔNG hỗ trợ cộng dồn.
- Có thể sử dụng tính năng Dream Lab với 500 lượt sử dụng (áp dụng cho mỗi thành viên và làm mới vào ngày đầu tiên của tháng).
Tuy nhiên chưa khả dụng cho tất cả mọi người.
    `,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-md">
      {/* Left - Image */}
      <div className="flex flex-col items-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg w-full object-contain max-h-60"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
          }}
        />
        <button className="text-blue-600 text-sm mt-2 hover:underline">
          Xem thêm ảnh
        </button>
      </div>

      {/* Right - Info */}
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Sản phẩm</p>
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

        <p className="text-sm text-gray-700">
          Tình trạng:
          <span className="ml-1 font-semibold text-green-600">
            {product.inStock ? "Còn hàng" : "Hết hàng"}
          </span>
        </p>

        <p className="text-sm text-gray-600">
          Mã sản phẩm: <span className="font-medium">{product.code}</span>
        </p>
        <p className="text-sm text-gray-600">
          Thể loại: <span className="font-medium">{product.tags}</span>
        </p>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-green-600">
            {product.price.toLocaleString()}đ
          </div>
          <div className="flex gap-2 items-center">
            <span className="line-through text-gray-400 text-sm">
              {product.originalPrice.toLocaleString()}đ
            </span>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
              -{product.discountPercent}%
            </span>
          </div>
        </div>

        {/* Duration buttons */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Chọn thời hạn</p>
          <div className="flex flex-wrap gap-2">
            {product.durations.map((label, i) => (
              <button
                key={i}
                className="px-3 py-1 border text-sm rounded hover:bg-blue-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Email input */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Nhập thông tin bổ sung
          </label>
          <input
            type="email"
            placeholder="Email Canva"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-blue-700 w-full">
            📥 Mua ngay
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-300 w-full">
            ➕ Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="md:col-span-2 mt-6 bg-red-50 text-sm text-gray-800 rounded-lg p-4 border border-red-200">
        <p className="font-semibold text-red-600 mb-2">Lưu ý:</p>
        <pre className="whitespace-pre-wrap">{product.note}</pre>
      </div>
    </div>
  );
};

export default ProductDetailPage;
