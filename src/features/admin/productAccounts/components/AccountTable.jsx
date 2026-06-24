import { useMemo, useState } from "react";
import { FaEdit, FaTrashAlt, FaUserPlus } from "react-icons/fa";
import AddProductAccountModal from "@/features/admin/productAccounts/components/AddProductAccountModal";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";

const statusText = {
  0: "Chua su dung",
  1: "Da ban",
  2: "Het han",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const AccountTable = ({ accounts = [], onEdit, onDelete, isLoading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState("valid");

  const { validAccounts, invalidAccounts } = useMemo(() => {
    const safe = Array.isArray(accounts) ? accounts : [];

    return {
      validAccounts: safe.filter((account) => account?.canSell === true),
      invalidAccounts: safe.filter((account) => account?.canSell === false),
    };
  }, [accounts]);

  const rowsToShow = viewFilter === "valid" ? validAccounts : invalidAccounts;

  const handleSaveModal = async (newData) => {
    await onEdit?.(newData);
  };

  if (isLoading) {
    return (
      <div className="min-w-0 flex-1">
        <PageState type="loading" description="Dang tai danh sach tai khoan..." />
      </div>
    );
  }

  return (
    <section className="min-w-0 flex-1 space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Danh sach tai khoan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Loc nhanh theo kha nang ban va quan ly account cua goi da chon.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="inline-flex overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setViewFilter("valid")}
                className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                  viewFilter === "valid"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Hop le ({validAccounts.length})
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
                Khong hop le ({invalidAccounts.length})
              </button>
            </div>

            <Button
              variant="info"
              leftIcon={<FaUserPlus />}
              onClick={() => setModalOpen(true)}
            >
              Them account
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {rowsToShow.length === 0 ? (
          <PageState
            type="empty"
            title={
              viewFilter === "valid"
                ? "Chua co tai khoan hop le"
                : "Khong co tai khoan khong hop le"
            }
            description="Du lieu se xuat hien sau khi them account vao goi nay."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Account</th>
                  <th className="px-4 py-3 font-semibold">Luot ban</th>
                  <th className="px-4 py-3 font-semibold">Trang thai</th>
                  <th className="px-4 py-3 font-semibold">Khoang ban</th>
                  <th className="px-4 py-3 font-semibold">Ngay them</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tac</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rowsToShow.map((account, index) => {
                  const canSell = account?.canSell === true;

                  return (
                    <tr
                      key={account.id ?? account.accountData ?? index}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="max-w-sm truncate font-medium text-slate-900">
                          {account.accountData || "-"}
                        </div>
                        {account.password && (
                          <div className="mt-1 text-xs text-slate-500">
                            Password: {account.password}
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
                            onClick={() => onEdit?.(account)}
                          >
                            Sua
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={<FaTrashAlt />}
                            onClick={() => onDelete?.(account.id)}
                          >
                            Xoa
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
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
      />
    </section>
  );
};

export default AccountTable;
