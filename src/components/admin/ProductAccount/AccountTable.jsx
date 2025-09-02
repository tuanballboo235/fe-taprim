import React, { useEffect, useMemo, useState } from "react";
import { FaUserPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import AddProductAccountModal from "./AddProductAccountModal/AddProductAccountModal";
import LoadingSpinner from "../../common/LoadingSpinner";
import clsx from "clsx";

const AccountTable = ({ accounts, onEdit, onDelete, isLoading, products }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [nameProductOption, setNameProductOption] = useState("");
  const [viewFilter, setViewFilter] = useState("valid"); // 'valid' | 'invalid'

  // tách danh sách hợp lệ / không hợp lệ
  const { validAccounts, invalidAccounts } = useMemo(() => {
    const safe = Array.isArray(accounts) ? accounts : [];
    return {
      validAccounts: safe.filter((a) => a?.canSell === true),
      invalidAccounts: safe.filter((a) => a?.canSell === false),
    };
  }, [accounts]);

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
    onEdit(newData); // dùng chung cho thêm/sửa
    handleCloseModal();
  };

  function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // render bảng theo dữ liệu (dùng lại cho 2 chế độ)
  const renderTable = (rows) => {
    if (isLoading) {
      return <LoadingSpinner text="Đang tải danh sách tài khoản..." />;
    }
    if (!rows || rows.length === 0) {
      return (
        <div className="text-gray-500 italic text-center">
          {viewFilter === "valid"
            ? "Chưa có tài khoản hợp lệ."
            : "Không có tài khoản không hợp lệ."}
        </div>
      );
    }

    return (
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
            {rows.map((acc, i) => {
              const canSell = acc?.canSell === true;
              return (
                <tr
                  key={acc.id ?? acc.accountData ?? i}
                  className={clsx(
                    "transition hover:bg-gray-50",
                    canSell ? "bg-green-50" : "bg-red-50"
                  )}
                >
                  <td className="p-3 w-80 border">
                    {acc.accountData}:{acc.password}
                  </td>
                  <td className="p-3 w-8 border">{acc.sellCount}</td>
                  <td className="p-3 w-8 border">{acc.status}</td>
                  <td className="p-3 w-28 border">
                    {formatDate(acc.sellFrom)} - {formatDate(acc.sellTo)}
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // dữ liệu theo chế độ hiện tại
  const rowsToShow = viewFilter === "valid" ? validAccounts : invalidAccounts;

  return (
    <div className="w-full p-4">
      {/* Header + nút hành động */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách tài khoản
        </h2>

        <div className="flex items-center gap-2">
          {/* Nút chuyển chế độ */}
          <div className="inline-flex rounded-md border overflow-hidden">
            <button
              type="button"
              onClick={() => setViewFilter("valid")}
              className={clsx(
                "px-3 py-2 text-sm",
                viewFilter === "valid"
                  ? "bg-green-600 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              )}
              title="Xem tài khoản hợp lệ"
            >
              Hợp lệ ({validAccounts.length})
            </button>
            <button
              type="button"
              onClick={() => setViewFilter("invalid")}
              className={clsx(
                "px-3 py-2 text-sm border-l",
                viewFilter === "invalid"
                  ? "bg-red-600 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              )}
              title="Xem tài khoản không hợp lệ"
            >
              Không hợp lệ ({invalidAccounts.length})
            </button>
          </div>

          {/* Nút thêm */}
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            onClick={() => handleOpenModal(null)}
          >
            <FaUserPlus /> Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Bảng */}
      <div className="mt-6 bg-white rounded shadow p-4">
        {renderTable(rowsToShow)}
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
