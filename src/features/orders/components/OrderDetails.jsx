import { useState } from "react";
import Button from "@/shared/components/Button";
import notify from "@/shared/utils/notify";

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) + "đ";

export default function OrderDetails({ order }) {
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.productAccountData || "");
      setCopied(true);
      notify.success("Đã copy account.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error("Không thể copy account.");
    }
  };

  const rows = [
    ["Mã giao dịch", order.paymentTransactionCode],
    ["Tên sản phẩm", `${order.productName} ${order.productOptionLabel}`],
    ["Email nhận hàng", order.contactInfo],
    ["Thời gian thanh toán", formatDateTime(order.paidAt)],
    ["Ngày tạo đơn", formatDateTime(order.createAt)],
    ["Hết hạn lấy mã", formatDateTime(order.expiredAt)],
    ["Tổng tiền", formatMoney(order.totalAmount)],
  ];

  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          Đơn hàng
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Chi tiết đơn hàng
        </h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-slate-100">
            {rows.map(([label, value]) => (
              <tr key={label} className="align-top">
                <td className="w-2/5 bg-slate-50 px-3 py-3 font-semibold text-slate-600 sm:px-4">
                  {label}
                </td>
                <td className="break-words px-3 py-3 text-slate-900 sm:px-4">
                  {value || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
        <h3 className="text-base font-semibold text-slate-900">
          Account sản phẩm
        </h3>

        {showAccount ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 shadow-sm">
              <span className="break-all">
                {order.productAccountData || "-"}
              </span>
            </div>
            <Button variant="info" onClick={handleCopy}>
              {copied ? "Đã copy" : "Copy"}
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => setShowAccount(true)}
          >
            Hiện account
          </Button>
        )}

        <p className="mt-3 text-sm text-red-600">
          Định dạng tài khoản email:password. Vui lòng đăng nhập đúng định dạng
        </p>
      </div>
    </section>
  );
}
