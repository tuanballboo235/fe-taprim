import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  KeyRound,
  LockKeyhole,
  PackageCheck,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserCircle,
  X,
} from "lucide-react";
import { changePassword } from "@/features/auth/api/authService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyProductOrders } from "@/features/orders/api/orderService";
import OrderDetails from "@/features/orders/components/OrderDetails";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const getValue = (source, key) => {
  const pascalKey = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  return source?.[key] ?? source?.[pascalKey];
};

const unwrapData = (response) => response?.data ?? response?.Data ?? response;

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  })}đ`;

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getPaymentStatusMeta = (status) => {
  if (Number(status) === 1) {
    return {
      label: "Đã thanh toán",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
  }

  return {
    label: "Đang chờ",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  };
};

const getOrderStatusMeta = (status) => {
  if (Number(status) === 1) {
    return "Đã cấp account";
  }

  return "Chưa hoàn tất";
};

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function UserDashboardPage() {
  const { user, isAdmin } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const ordersQuery = useQuery({
    queryKey: ["userProductOrders"],
    queryFn: getMyProductOrders,
  });

  const ordersPayload = unwrapData(ordersQuery.data);
  const orders = useMemo(() => {
    const items = getValue(ordersPayload, "items");
    return Array.isArray(items) ? items : [];
  }, [ordersPayload]);

  const summary = getValue(ordersPayload, "summary") ?? {};
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredOrders = useMemo(() => {
    if (!normalizedKeyword) return orders;

    return orders.filter((order) => {
      const values = [
        getValue(order, "paymentTransactionCode"),
        getValue(order, "productName"),
        getValue(order, "productOptionLabel"),
        getValue(order, "contactInfo"),
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(normalizedKeyword),
      );
    });
  }, [normalizedKeyword, orders]);

  const stats = [
    {
      label: "Tổng đơn",
      value: getValue(summary, "totalOrders") ?? orders.length,
      icon: <ReceiptText className="h-5 w-5" />,
    },
    {
      label: "Đã thanh toán",
      value:
        getValue(summary, "paidOrders") ??
        orders.filter((order) => Number(getValue(order, "paymentStatus")) === 1)
          .length,
      icon: <PackageCheck className="h-5 w-5" />,
    },
    {
      label: "Tài khoản đã mua",
      value:
        getValue(summary, "totalQuantity") ??
        orders.reduce((sum, order) => sum + Number(getValue(order, "quantity") || 0), 0),
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      label: "Tổng chi tiêu",
      value: formatMoney(getValue(summary, "totalRevenue")),
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      notify.warning("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      notify.warning("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify.warning("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(passwordForm);
      setPasswordForm(initialPasswordForm);
      notify.success("Đã đổi mật khẩu thành công.");
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Không thể đổi mật khẩu."));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <UserCircle className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-700">Dashboard user</p>
                <h1 className="truncate text-2xl font-semibold text-slate-950">
                  {user?.username || "Tài khoản của tôi"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Quản lý đơn đã mua, bảo mật tài khoản và các thao tác nhanh.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/order-lookup"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Search className="h-4 w-4" />
                Tra cứu đơn
              </Link>
              <Link
                to="/product"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <ShoppingBag className="h-4 w-4" />
                Mua thêm
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">{item.label}</span>
                <span className="text-green-700">{item.icon}</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Đơn đã mua</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Các đơn được gắn với tài khoản khi bạn thanh toán trong trạng thái đăng nhập.
                  </p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm mã đơn, sản phẩm, email..."
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {ordersQuery.isLoading ? (
                <PageState type="loading" description="Đang tải đơn hàng của bạn..." />
              ) : ordersQuery.isError ? (
                <PageState
                  type="error"
                  description="Không thể tải đơn hàng của bạn."
                  actionLabel="Tải lại"
                  onAction={ordersQuery.refetch}
                />
              ) : filteredOrders.length === 0 ? (
                <PageState
                  type="empty"
                  title={keyword ? "Không tìm thấy đơn phù hợp" : "Bạn chưa có đơn hàng"}
                  description={keyword ? "Thử tìm bằng mã giao dịch hoặc tên sản phẩm khác." : "Các đơn mua khi đăng nhập sẽ hiển thị tại đây."}
                  actionLabel={keyword ? undefined : "Xem sản phẩm"}
                  onAction={keyword ? undefined : () => window.location.assign("/product")}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-3 font-semibold">Đơn hàng</th>
                        <th className="px-3 py-3 font-semibold">Sản phẩm</th>
                        <th className="px-3 py-3 font-semibold">Số lượng</th>
                        <th className="px-3 py-3 font-semibold">Thanh toán</th>
                        <th className="px-3 py-3 font-semibold">Tổng tiền</th>
                        <th className="px-3 py-3 text-right font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((order) => {
                        const paymentStatus = getPaymentStatusMeta(
                          getValue(order, "paymentStatus"),
                        );
                        const orderId = getValue(order, "orderId");
                        const transactionCode = getValue(order, "paymentTransactionCode");

                        return (
                          <tr key={orderId ?? transactionCode} className="align-top hover:bg-slate-50">
                            <td className="px-3 py-3">
                              <p className="font-semibold text-slate-900">
                                {transactionCode || `#${orderId}`}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {formatDateTime(getValue(order, "paidAt") ?? getValue(order, "createAt"))}
                              </p>
                            </td>
                            <td className="px-3 py-3">
                              <p className="font-medium text-slate-900">
                                {getValue(order, "productName") || "-"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {getValue(order, "productOptionLabel") || getOrderStatusMeta(getValue(order, "orderStatus"))}
                              </p>
                            </td>
                            <td className="px-3 py-3 font-semibold text-slate-800">
                              {getValue(order, "quantity") || 1}
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-semibold ${paymentStatus.className}`}
                              >
                                {paymentStatus.icon}
                                {paymentStatus.label}
                              </span>
                            </td>
                            <td className="px-3 py-3 font-semibold text-green-700">
                              {formatMoney(getValue(order, "totalAmount"))}
                            </td>
                            <td className="px-3 py-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<Eye className="h-3.5 w-3.5" />}
                                onClick={() => setSelectedOrder(order)}
                              >
                                Chi tiết
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <form
              onSubmit={handleChangePassword}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-md bg-green-50 p-2 text-green-700">
                  <LockKeyhole className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Đổi mật khẩu</h2>
                  <p className="text-sm text-slate-500">Cập nhật mật khẩu đăng nhập.</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">
                    Mật khẩu hiện tại
                  </span>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    autoComplete="current-password"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">
                    Mật khẩu mới
                  </span>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">
                    Xác nhận mật khẩu mới
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <Button
                type="submit"
                fullWidth
                className="mt-4"
                isLoading={isChangingPassword}
                leftIcon={<KeyRound className="h-4 w-4" />}
              >
                Lưu mật khẩu mới
              </Button>
            </form>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-blue-50 p-2 text-blue-700">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h2 className="text-base font-semibold text-slate-950">Chức năng khác</h2>
              </div>
              <div className="grid gap-2">
                <Link
                  to="/order-lookup"
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                >
                  Tra cứu đơn bằng mã giao dịch
                  <Search className="h-4 w-4" />
                </Link>
                <Link
                  to="/netflix-code"
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                >
                  Lấy mã đăng nhập Netflix
                  <KeyRound className="h-4 w-4" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                  >
                    Vào trang admin
                    <ShieldCheck className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow hover:text-red-600"
              aria-label="Đóng chi tiết đơn"
            >
              <X className="h-4 w-4" />
            </button>
            <OrderDetails order={selectedOrder} />
          </div>
        </div>
      )}
    </section>
  );
}