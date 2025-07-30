import React from "react";
import { useNavigate } from "react-router-dom";

import { FaEdit, FaPlus } from "react-icons/fa";

const AdminProductTable = ({ data = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 border">Tên gian hàng</th>
            <th className="px-4 py-3 border">Đơn giá</th>
            <th className="px-4 py-3 border">Kho</th>
            <th className="px-4 py-3 border">Trạng thái</th>
            <th className="px-4 py-3 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.flatMap((category) =>
              category.products.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">
                    {item.minPrice || item.maxPrice
                      ? `${item.minPrice ?? "?"} - ${item.maxPrice ?? "?"}đ`
                      : "Không có giá"}
                  </td>
                  <td className="px-4 py-2 border">
                    {" "}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded 
              ${item.stockAccount > 0 ? "" : "bg-red-100 text-red-700"}`}
                    >
                      {item.stockAccount > 0 ? item.stockAccount : "Hết hàng"}
                    </span>
                  </td>

                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded 
              ${
                item.status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
                    >
                      {item.status === 1 ? "Hoạt động" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Chỉnh sửa"
                      onClick={() =>
                        navigate(`/admin-product-account/${item.id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Thêm tài khoản"
                    >
                      <FaPlus />
                    </button>
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductTable;
