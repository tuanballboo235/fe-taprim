import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Copy,
  DollarSign,
  Filter,
  PackageCheck,
  RefreshCcw,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";
import { getAdminProductOrders } from "@/features/orders/api/orderService";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const PAYMENT_STATUS = {
  pending: 0,
  paid: 1,
};

const PERIOD_OPTIONS = [
  { key: "1d", label: "1 ngày", getStartDate: (today) => today },
  {
    key: "1w",
    label: "1 tuần",
    getStartDate: (today) => addDays(today, -6),
  },
  {
    key: "1m",
    label: "1 tháng",
    getStartDate: (today) => addMonths(today, -1),
  },
  {
    key: "3m",
    label: "3 tháng",
    getStartDate: (today) => addMonths(today, -3),
  },
  {
    key: "6m",
    label: "6 tháng",
    getStartDate: (today) => addMonths(today, -6),
  },
  {
    key: "1y",
    label: "1 năm",
    getStartDate: (today) => addYears(today, -1),
  },
];

const PAGE_SIZE = 20;

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(date, amount) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
}

function addYears(date, amount) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + amount);
  return result;
}

function toInputDate(date) {
  const normalized = new Date(date);
  normalized.setMinutes(normalized.getMinutes() - normalized.getTimezoneOffset());
  return normalized.toISOString().slice(0, 10);
}

function getPresetRange(periodKey = "1m") {
  const today = new Date();
  const option =
    PERIOD_OPTIONS.find((period) => period.key === periodKey) ??
    PERIOD_OPTIONS[2];

  return {
    fromDate: toInputDate(option.getStartDate(today)),
    toDate: toInputDate(today),
  };
}

function formatMoney(value) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(value) {
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
}

function formatInputDateLabel(value) {
  if (!value) return "-";

  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

function getPaymentStatusLabel(status) {
  if (Number(status) === PAYMENT_STATUS.paid) return "Đã thanh toán";
  if (Number(status) === PAYMENT_STATUS.pending) return "Chờ thanh toán";
  return "Không xác định";
}

function getPaymentStatusClass(status) {
  if (Number(status) === PAYMENT_STATUS.paid) {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (Number(status) === PAYMENT_STATUS.pending) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function getResponseData(response) {
  return response?.data ?? response?.Data ?? {};
}

function getItems(payload) {
  return payload?.items ?? payload?.Items ?? [];
}

function getSummary(payload) {
  return payload?.summary ?? payload?.Summary ?? {};
}

function getNumber(payload, key, fallback = 0) {
  return Number(payload?.[key] ?? payload?.[capitalize(key)] ?? fallback);
}

function capitalize(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

export default function AdminProductOrdersPage() {
  const [period, setPeriod] = useState("1m");
  const [range, setRange] = useState(() => getPresetRange("1m"));
  const [keyword, setKeyword] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(String(PAYMENT_STATUS.paid));
  const [page, setPage] = useState(1);
  const debouncedKeyword = useDebounce(keyword, 350);

  const queryFilters = useMemo(
    () => ({
      fromDate: range.fromDate,
      toDate: range.toDate,
      keyword: debouncedKeyword.trim(),
      paymentStatus:
        paymentStatus === "all" ? undefined : Number(paymentStatus),
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedKeyword, page, paymentStatus, range.fromDate, range.toDate]
  );

  const ordersQuery = useQuery({
    queryKey: ["adminProductOrders", queryFilters],
    queryFn: () => getAdminProductOrders(queryFilters),
  });

  const payload = getResponseData(ordersQuery.data);
  const items = getItems(payload);
  const summary = getSummary(payload);
  const totalPages = getNumber(payload, "totalPages");
  const totalRecords = getNumber(payload, "totalRecords");

  const stats = [
    {
      label: "Doanh thu",
      value: formatMoney(summary.totalRevenue ?? summary.TotalRevenue),
      icon: <DollarSign className="h-5 w-5" />,
      tone: "bg-green-50 text-green-700",
    },
    {
      label: "Đơn đã thanh toán",
      value: getNumber(summary, "paidOrders"),
      icon: <PackageCheck className="h-5 w-5" />,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Số lượng bán",
      value: getNumber(summary, "totalQuantity"),
      icon: <ShoppingCart className="h-5 w-5" />,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Giá trị trung bình",
      value: formatMoney(summary.averageOrderValue ?? summary.AverageOrderValue),
      icon: <Users className="h-5 w-5" />,
      tone: "bg-orange-50 text-orange-700",
    },
  ];

  useEffect(() => {
    if (ordersQuery.error) {
      notify.error(
        getApiErrorMessage(
          ordersQuery.error,
          "Không thể tải danh sách đơn hàng sản phẩm."
        )
      );
    }
  }, [ordersQuery.error]);

  const handlePeriodChange = (nextPeriod) => {
    setPeriod(nextPeriod);
    setRange(getPresetRange(nextPeriod));
    setPage(1);
  };

  const handleRangeChange = (field, value) => {
    setPeriod("custom");
    setRange((current) => ({
      ...current,
      [field]: value,
    }));
    setPage(1);
  };

  const handleCopy = async (value, label) => {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    notify.success(`Đã sao chép ${label}.`);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-green-700">
            Quản trị đơn hàng
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Đơn hàng sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi đơn đã mua, lọc theo thời gian và đối soát doanh thu.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => ordersQuery.refetch()}
          isLoading={ordersQuery.isFetching}
          leftIcon={<RefreshCcw className="h-4 w-4" />}
        >
          Làm mới
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-xl font-bold text-slate-950">
                  {stat.value}
                </p>
              </div>
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${stat.tone}`}
              >
                {stat.icon}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Filter className="h-4 w-4 text-green-700" />
          Bộ lọc
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => {
                const isActive = period === option.key;

                return (
                  <button
                    type="button"
                    key={option.key}
                    onClick={() => handlePeriodChange(option.key)}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-medium text-slate-700">
                Từ ngày
                <span className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={range.fromDate}
                    onChange={(event) =>
                      handleRangeChange("fromDate", event.target.value)
                    }
                    className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
                  />
                </span>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Đến ngày
                <span className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={range.toDate}
                    onChange={(event) =>
                      handleRangeChange("toDate", event.target.value)
                    }
                    className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
                  />
                </span>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Trạng thái thanh toán
                <select
                  value={paymentStatus}
                  onChange={(event) => {
                    setPaymentStatus(event.target.value);
                    setPage(1);
                  }}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                >
                  <option value={PAYMENT_STATUS.paid}>Đã thanh toán</option>
                  <option value={PAYMENT_STATUS.pending}>Chờ thanh toán</option>
                  <option value="all">Tất cả</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Tìm kiếm
                <span className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(event) => {
                      setKeyword(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Mã giao dịch, email, sản phẩm"
                    className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-800">Khoảng đang xem</p>
            <p className="mt-1 text-slate-600">
              {formatInputDateLabel(range.fromDate)} -{" "}
              {formatInputDateLabel(range.toDate)}
            </p>
            <p className="mt-3 text-slate-500">
              Tổng bản ghi:{" "}
              <span className="font-semibold text-slate-900">
                {totalRecords}
              </span>
            </p>
          </div>
        </div>
      </div>

      {ordersQuery.isLoading ? (
        <PageState
          type="loading"
          title="Đang tải đơn hàng"
          description="Vui lòng đợi trong giây lát."
        />
      ) : ordersQuery.isError ? (
        <PageState
          type="error"
          title="Không thể tải đơn hàng"
          description={getApiErrorMessage(ordersQuery.error)}
          actionLabel="Thử lại"
          onAction={() => ordersQuery.refetch()}
        />
      ) : items.length === 0 ? (
        <PageState
          type="empty"
          title="Chưa có đơn hàng"
          description="Không có đơn hàng sản phẩm nào khớp với bộ lọc hiện tại."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã giao dịch</th>
                  <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Số lượng
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 font-semibold">Thanh toán</th>
                  <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                  <th className="px-4 py-3 font-semibold">Ngày thanh toán</th>
                  <th className="px-4 py-3 font-semibold">Tài khoản</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((order) => (
                  <tr
                    key={order.orderId ?? order.OrderId}
                    className="align-top transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            order.paymentTransactionCode ??
                              order.PaymentTransactionCode,
                            "mã giao dịch"
                          )
                        }
                        className="inline-flex max-w-[180px] items-center gap-2 rounded-md border border-slate-200 px-2 py-1 font-mono text-xs font-semibold text-slate-700 transition hover:border-green-300 hover:text-green-700"
                      >
                        <span className="truncate">
                          {order.paymentTransactionCode ??
                            order.PaymentTransactionCode ??
                            "-"}
                        </span>
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {order.productName ?? order.ProductName ?? "-"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.productOptionLabel ??
                          order.ProductOptionLabel ??
                          "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {order.contactInfo ?? order.ContactInfo ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-900">
                      {order.quantity ?? order.Quantity ?? 1}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {formatMoney(order.totalAmount ?? order.TotalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getPaymentStatusClass(
                          order.paymentStatus ?? order.PaymentStatus
                        )}`}
                      >
                        {getPaymentStatusLabel(
                          order.paymentStatus ?? order.PaymentStatus
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(order.createAt ?? order.CreateAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(order.paidAt ?? order.PaidAt)}
                    </td>
                    <td className="px-4 py-3">
                      {order.productAccountData || order.ProductAccountData ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              order.productAccountData ??
                                order.ProductAccountData,
                              "tài khoản"
                            )
                          }
                          className="inline-flex max-w-[220px] items-center gap-2 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:border-green-300 hover:text-green-700"
                        >
                          <span className="truncate">
                            {order.productAccountData ??
                              order.ProductAccountData}
                          </span>
                          <Copy className="h-3.5 w-3.5 shrink-0" />
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Trang{" "}
              <span className="font-semibold text-slate-800">{page}</span>
              {totalPages > 0 && (
                <>
                  {" "}
                  /{" "}
                  <span className="font-semibold text-slate-800">
                    {totalPages}
                  </span>
                </>
              )}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                Trước
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={totalPages === 0 || page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
