import React from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';

const AdminProductTable = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 border">Tên gian hàng</th>
            <th className="px-4 py-3 border">Loại Reseller</th>
            <th className="px-4 py-3 border">Đơn giá</th>
            <th className="px-4 py-3 border">Sàn</th>
            <th className="px-4 py-3 border">Kho</th>
            <th className="px-4 py-3 border">Ngày tạo</th>
            <th className="px-4 py-3 border">Trạng thái</th>
            <th className="px-4 py-3 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.shopName}</td>
                <td className="px-4 py-2 border">{item.resellerType}</td>
                <td className="px-4 py-2 border">{item.price}đ</td>
                <td className="px-4 py-2 border">{item.platform}</td>
                <td className="px-4 py-2 border">{item.stock}</td>
                <td className="px-4 py-2 border">{item.createdAt}</td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 text-xs font-semibold rounded 
                    ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status === 'active' ? 'Đang hoạt động' : 'Ngừng bán'}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button className="text-blue-600 hover:text-blue-800 mr-3" title="Chỉnh sửa">
                    <FaEdit />
                  </button>
                  <button className="text-green-600 hover:text-green-800" title="Thêm tài khoản">
                    <FaPlus />
                  </button>
                </td>
              </tr>
            ))
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
