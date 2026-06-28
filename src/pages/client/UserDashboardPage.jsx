import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
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
import {
  DashboardActions,
  DashboardHero,
  DashboardLayout,
  DashboardPanel,
  DashboardStats,
} from "@/shared/components/DashboardLayout";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600";

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
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
  }

  return {
    label: "Đang chờ",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  };
};

const getOrderStatusLabel = (status) =>
  Number(status) === 1 ? "Đã cấp account" : "Chưa hoàn tất";

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function EmptyOrders({ hasKeyword, onShop }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center text-center">
      <div className="max-w-sm">
        <ShoppingBag className="mx-auto h-9 w-9 text-slate-300" />
        <h3 className="mt-3 text-base font-semibold text-slate-950">
          {hasKeyword ? "Không tìm thấy đơn phù hợp" : "Bạn chưa có đơn hàng"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {hasKeyword
            ? "Thử tìm bằng mã giao dịch, tên sản phẩm hoặc email khác."
            : "Các đơn mua khi đăng nhập sẽ được lưu vào dashboard này."}
        </p>
        {!hasKeyword && (
          <Button className="mt-4" onClick={onShop}>
            Xem sản phẩm
          </Button>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onView }) {
  const paymentStatus = getPaymentStatusMeta(getValue(order, "paymentStatus"));
  const orderId = getValue(order, "orderId");
  const transactionCode = getValue(order, "paymentTransactionCode");
  const productName = getValue(order, "productName") || "-";
  const optionLabel = getValue(order, "productOptionLabel");
  const quantity = getValue(order, "quantity") || 1;
  const orderStatus = getOrderStatusLabel(getValue(order, "orderStatus"));

  return (
    <article className="rounded-lg border border-slate-300 bg-slate-50/60 p-4 transition hover:border-emerald-300 hover:bg-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-950">
              {transactionCode || `#${orderId}`}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-semibold ${paymentStatus.className}`}
            >
              {paymentStatus.icon}
              {paymentStatus.label}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {productName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {optionLabel || orderStatus}
          </p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-3 md:min-w-[330px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Số lượng
            </p>
            <p className="mt-1 font-semibold text-slate-900">{quantity}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tổng tiền
            </p>
            <p className="mt-1 font-semibold text-emerald-700">
              {formatMoney(getValue(order, "totalAmount"))}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Thời gian
            </p>
            <p className="mt-1 text-slate-700">
              {formatDateTime(
                getValue(order, "paidAt") ?? getValue(order, "createAt"),
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-slate-200 pt-3">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          onClick={onView}
        >
          Chi tiết
        </Button>
      </div>
    </article>
  );
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
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
      tone: "sky",
    },
    {
      label: "Đã thanh toán",
      value:
        getValue(summary, "paidOrders") ??
        orders.filter((order) => Number(getValue(order, "paymentStatus")) === 1)
          .length,
      icon: <PackageCheck className="h-5 w-5" />,
      tone: "emerald",
    },
    {
      label: "Tài khoản đã mua",
      value:
        getValue(summary, "totalQuantity") ??
        orders.reduce(
          (sum, order) => sum + Number(getValue(order, "quantity") || 0),
          0,
        ),
      icon: <ShoppingBag className="h-5 w-5" />,
      tone: "amber",
    },
    {
      label: "Tổng chi tiêu",
      value: formatMoney(getValue(summary, "totalRevenue")),
      icon: <ShieldCheck className="h-5 w-5" />,
      tone: "slate",
    },
  ];

  const actions = [
    {
      as: Link,
      to: "/product",
      label: "Mua sản phẩm",
      description: "Xem gói đang bán và mua thêm tài khoản.",
      icon: <ShoppingBag className="h-5 w-5" />,
      tone: "emerald",
    },
    {
      as: Link,
      to: "/order-lookup",
      label: "Tra cứu đơn",
      description: "Tìm đơn bằng mã giao dịch khi cần kiểm tra nhanh.",
      icon: <Search className="h-5 w-5" />,
      tone: "sky",
    },
    {
      as: Link,
      to: "/netflix-code",
      label: "Mã Netflix",
      description: "Lấy mã đăng nhập Netflix từ đơn đã mua.",
      icon: <KeyRound className="h-5 w-5" />,
      tone: "amber",
    },
    ...(isAdmin
      ? [
          {
            as: Link,
            to: "/admin",
            label: "Trang admin",
            description: "Chuyển sang bộ công cụ quản trị.",
            icon: <ShieldCheck className="h-5 w-5" />,
            tone: "slate",
          },
        ]
      : []),
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
    <div className="bg-slate-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <DashboardLayout>
          <DashboardHero
            eyebrow={isAdmin ? "Dashboard cá nhân admin" : "Dashboard user"}
            title={user?.username || "Tài khoản của tôi"}
            description="Quản lý đơn đã mua, bảo mật tài khoản và truy cập nhanh các công cụ thường dùng."
            icon={<UserCircle className="h-7 w-7" />}
            badges={[isAdmin ? "Admin" : "User", "Đơn hàng", "Bảo mật"]}
            actions={
              <>
                <Link
                  to="/order-lookup"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Search className="h-4 w-4" />
                  Tra cứu đơn
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Mua thêm
                </Link>
              </>
            }
          />

          <DashboardStats items={stats} />
          <DashboardActions items={actions} />

          <div className="grid gap-5 xl:grid-cols-12 xl:items-start">
            <DashboardPanel
              className="xl:col-span-8"
              title="Đơn đã mua"
              description="Các đơn được gắn với tài khoản khi bạn thanh toán trong trạng thái đăng nhập."
              icon={<ReceiptText className="h-4 w-4" />}
              action={
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm mã đơn, sản phẩm..."
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              }
            >
              {ordersQuery.isLoading ? (
                <div className="flex min-h-[220px] items-center justify-center text-sm font-medium text-slate-500">
                  Đang tải đơn hàng của bạn...
                </div>
              ) : ordersQuery.isError ? (
                <div className="flex min-h-[220px] items-center justify-center text-center">
                  <div>
                    <AlertCircle className="mx-auto h-9 w-9 text-rose-400" />
                    <h3 className="mt-3 text-base font-semibold text-slate-950">
                      Không thể tải đơn hàng
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Vui lòng thử tải lại sau ít giây.
                    </p>
                    <Button className="mt-4" onClick={() => ordersQuery.refetch()}>
                      Tải lại
                    </Button>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <EmptyOrders
                  hasKeyword={Boolean(keyword)}
                  onShop={() => navigate("/product")}
                />
              ) : (
                <div className="grid gap-3">
                  {filteredOrders.map((order) => {
                    const orderId = getValue(order, "orderId");
                    const transactionCode = getValue(
                      order,
                      "paymentTransactionCode",
                    );

                    return (
                      <OrderCard
                        key={orderId ?? transactionCode}
                        order={order}
                        onView={() => setSelectedOrder(order)}
                      />
                    );
                  })}
                </div>
              )}
            </DashboardPanel>

            <div className="space-y-5 xl:col-span-4">
              <DashboardPanel
                title="Đổi mật khẩu"
                description="Cập nhật mật khẩu đăng nhập của tài khoản."
                icon={<LockKeyhole className="h-4 w-4" />}
              >
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-slate-700">
                      Mật khẩu hiện tại
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={inputClass}
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
                      className={inputClass}
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
                      className={inputClass}
                      autoComplete="new-password"
                    />
                  </label>

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
              </DashboardPanel>

              <DashboardPanel
                title="Trạng thái tài khoản"
                description="Thông tin nhanh để bạn kiểm tra phiên đăng nhập."
                icon={<ShieldCheck className="h-4 w-4" />}
              >
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-slate-500">Vai trò</span>
                    <strong className="text-slate-900">
                      {isAdmin ? "Admin" : "User"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-slate-500">Đơn hiển thị</span>
                    <strong className="text-slate-900">
                      {filteredOrders.length}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      Cập nhật
                    </span>
                    <strong className="text-slate-900">Theo thời gian thực</strong>
                  </div>
                </div>
              </DashboardPanel>
            </div>
          </div>
        </DashboardLayout>
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
    </div>
  );
}
