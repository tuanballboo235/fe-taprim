import React, { useEffect, useState } from "react";
import { FaUserPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import AddProductAccountModal from "./AddProductAccountModal";
import LoadingSpinner from "../../common/LoadingSpinner";

const AccountTable = ({ accounts, onEdit, onDelete, isLoading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [nameProductOption, setNameProductOption] = useState("");

  useEffect(() => {
    if (selectedAccount) {
      setNameProductOption(selectedAccount.productOptionName);
    }
  }, [selectedAccount]);

  const handleOpenModal = (account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
    setModalOpen(false);
  };

  const handleSaveModal = (newData) => {
    if (selectedAccount) {
      // chỉnh sửa
      onEdit(newData);
    } else {
      // thêm mới
      onEdit(newData);
    }
    handleCloseModal();
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="w-full p-4">
      {/* Khu vực quản lý tài khoản */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách tài khoản</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => handleOpenModal(null)}
        >
          <FaUserPlus /> Thêm tài khoản
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="mt-6 bg-white rounded shadow p-4">
        {isLoading ? (
          <LoadingSpinner text="Đang tải danh sách tài khoản..." />
        ) : accounts.length === 0 ? (
          <div className="text-gray-500 italic text-center">Chưa có tài khoản nào được thêm.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 w-80 border">Account</th>
                  <th className="p-3 w-8 border">Lượt bán</th>
                  <th className="p-3 w-8 border">Trạng thái</th>
                  <th className="p-3 w-28 border">Khoảng bán</th>
                  <th className="p-3 w-28 border">Ngày thêm</th>
                  <th className="p-3 border text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, i) => (
                  <tr
                    key={i}
                    className={`transition hover:bg-gray-50 ${
                      acc.canSell ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <td className="p-3 w-80 border">{acc.accountData}:{acc.password}</td>
                    <td className="p-3 w-8 border">{acc.sellCount}</td>
                    <td className="p-3 w-8 border">{acc.status}</td>
                    <td className="p-3 w-28 border">{formatDate(acc.sellFrom)} - {formatDate(acc.sellTo)}</td>
                    <td className="p-3 w-28 border">{formatDate(acc.createAt)}</td>
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

      {/* Modal thêm/sửa tài khoản */}
      <AddProductAccountModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        
      />
    </div>
  );
};

export default AccountTable;
