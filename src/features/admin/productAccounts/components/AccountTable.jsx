import { useMemo, useState } from "react";
import { FaEdit, FaSearch, FaTrashAlt, FaUserPlus } from "react-icons/fa";
import AddProductAccountModal from "@/features/admin/productAccounts/components/AddProductAccountModal";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";

const statusText = {
  0: "Chưa sử dụng",
  1: "Đang bán",
  2: "Hết hạn",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const getAccountId = (account) => account?.productAccountId ?? account?.id;

const AccountTable = ({
  accounts = [],
  onEdit,
  onDelete,
  isLoading,
  searchTerm = "",
  onSearchChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [viewFilter, setViewFilter] = useState("valid");

  const { validAccounts, invalidAccounts } = useMemo(() => {
    const safe = Array.isArray(accounts) ? accounts : [];

    return {
      validAccounts: safe.filter((account) => account?.canSell === true),
      invalidAccounts: safe.filter((account) => account?.canSell !== true),
    };
  }, [accounts]);

  const rowsToShow = viewFilter === "valid" ? validAccounts : invalidAccounts;

  const handleSaveModal = async (newData) => {
    const payloads = Array.isArray(newData) ? newData : [newData];

    if (editingAccount) {
      await onEdit?.({
        ...payloads[0],
        productAccountId: getAccountId(editingAccount),
      });
      return;
    }

    await onEdit?.(payloads);
  };

  const handleOpenAddModal = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (account) => {
    setEditingAccount(account);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAccount(null);
  };

  if (isLoading) {
    return (
      <div className="min-w-0 flex-1">
        <PageState type="loading" description="Đang tải danh sách account..." />
      </div>
    );
  }

  return (
    <section className="min-w-0 flex-1 space-y-4">
      <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-md shadow-slate-200/70">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Danh sách account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lọc nhanh account đang bán và account chưa hợp lệ của gói đã chọn.
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <label className="relative block min-w-0 sm:w-72">
              <span className="sr-only">Tìm kiếm account</span>
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder="Tìm theo email hoặc username..."
                className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </label>

            <div className="inline-flex overflow-hidden rounded-md border border-slate-300 bg-slate-50 p-1 shadow-sm shadow-slate-200/70">
              <button
                type="button"
                onClick={() => setViewFilter("valid")}
                className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                  viewFilter === "valid"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Hợp lệ ({validAccounts.length})
              </button>
              <button
                type="button"
                onClick={() => setViewFilter("invalid")}
                className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                  viewFilter === "invalid"
                    ? "bg-white text-red-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Không hợp lệ ({invalidAccounts.length})
              </button>
            </div>

            <Button
              variant="info"
              leftIcon={<FaUserPlus />}
              onClick={handleOpenAddModal}
            >
              Thêm account
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-md shadow-slate-200/70">
        {rowsToShow.length === 0 ? (
          <PageState
            type="empty"
            title={
              viewFilter === "valid"
                ? "Chưa có account hợp lệ"
                : "Không có account không hợp lệ"
            }
            description={
              searchTerm
                ? "Không tìm thấy account phù hợp với từ khóa hiện tại."
                : "Dữ liệu sẽ xuất hiện sau khi thêm account vào gói này."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Account</th>
                  <th className="px-4 py-3 font-semibold">Lượt bán</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">Khoảng bán</th>
                  <th className="px-4 py-3 font-semibold">Ngày thêm</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rowsToShow.map((account, index) => {
                  const accountId = getAccountId(account);
                  const canSell = account?.canSell === true;

                  return (
                    <tr
                      key={accountId ?? account.accountData ?? index}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="max-w-sm truncate font-medium text-slate-900">
                          {account.accountData || "-"}
                        </div>
                        {account.passwordProductAccount && (
                          <div className="mt-1 text-xs text-slate-500">
                            Mật khẩu: {account.passwordProductAccount}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {account.sellCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            canSell
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {statusText[account.status] ?? account.status ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(account.sellFrom)} - {formatDate(account.sellTo)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(account.createAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<FaEdit />}
                            onClick={() => handleOpenEditModal(account)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={<FaTrashAlt />}
                            onClick={() => onDelete?.(accountId)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductAccountModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        initialData={editingAccount}
      />
    </section>
  );
};

export default AccountTable;
