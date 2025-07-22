import React from "react";
import { FaUserPlus, FaTrashAlt, FaEdit } from "react-icons/fa";

const AccountTable = ({ accounts, onEdit, onDelete }) => {
  return (
    <div className="w-full md:w-2/3 xl:w-3/4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách tài khoản</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => onEdit(null)}
        >
          <FaUserPlus /> Thêm tài khoản
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-gray-500 italic">Chưa có tài khoản nào được thêm.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
              
                <th className="p-3 border">Account Data</th>
             
                <th className="p-3 border">Lượt bán</th>
                   <th className="p-3 border">Trạng thái</th>
                <th className="p-3 border">Có thể bán</th>
                <th className="p-3 border text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => (
                <tr key={acc.id} className="hover:bg-gray-50 transition-all">
                  <td className="p-3 border">{acc.email}:{acc.password}</td>
                  <td className="p-3 border"></td>
                      <td className="p-3 border"></td>
                          <td className="p-3 border"></td>
                  <td className="p-3 border text-center space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEdit(acc)}
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete(acc.id)}
                      title="Xóa"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountTable;
