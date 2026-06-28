import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  DollarSign,
  Eye,
  PackageCheck,
  PlusCircle,
  RefreshCcw,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tags,
  UserCircle,
} from "lucide-react";
import { getAdminProductOrders } from "@/features/orders/api/orderService";
import { useAdminProducts } from "@/features/adminProducts/hooks/useAdminProducts";
import Button from "@/shared/components/Button";
import {
  DashboardActions,
  DashboardHero,
  DashboardLayout,
  DashboardPanel,
  DashboardStats,
} from "@/shared/components/DashboardLayout";

const getValue = (source, key, fallback = undefined) => {
  const pascalKey = key ? `${key.charAt(0).toUpperCase()}${key.slice(1)}` : key;
  return source?.[key] ?? source?.[pascalKey] ?? fallback;
};

const unwrapData = (response) => response?.data ?? response?.Data ?? response ?? {};
const getItems = (payload) => getValue(payload, "items", []);
const getSummary = (payload) => getValue(payload, "summary", {});
const getNumber = (source, key) => Number(getValue(source, key, 0) || 0);

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

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

function RecentOrderRow({ order }) {
  const transactionCode = getValue(order, "paymentTransactionCode") || "-";
  const productName = getValue(order, "productName") || "Sản phẩm";
  const quantity = getValue(order, "quantity", 1);
  const totalAmount = getValue(order, "totalAmount", 0);

  return (
    <div className="rounded-lg border border-slate-300 bg-slate-50/70 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {transactionCode}
          </p>
          <p className="mt-1 text-sm text-slate-600">{productName}</p>
          <p className="mt-1 text-xs text-slate-500">
            {formatDateTime(getValue(order, "paidAt") ?? getValue(order, "createAt"))}
          </p>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-sm font-semibold text-emerald-700">
            {formatMoney(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-slate-500">SL: {quantity}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const ordersQuery = useQuery({
    queryKey: ["adminDashboardProductOrders"],
    queryFn: () =>
      getAdminProductOrders({
        paymentStatus: 1,
        page: 1,
        pageSize: 5,
      }),
  });
  const productsQuery = useAdminProducts();

  const ordersPayload = unwrapData(ordersQuery.data);
  const orders = getItems(ordersPayload);
  const summary = getSummary(ordersPayload);

  const productSections = useMemo(() => {
    const payload = productsQuery.data?.data ?? productsQuery.data?.Data ?? [];
    return Array.isArray(payload) ? payload : [];
  }, [productsQuery.data]);

  const productMetrics = useMemo(() => {
    const products = productSections.flatMap((section) => section.products ?? []);
    const activeProducts = products.filter((product) => Number(product.status) === 1);
    const hiddenProducts = products.filter((product) => Number(product.status) !== 1);
    const accountStock = products.reduce(
      (sum, product) => sum + Number(product.stockAccount ?? 0),
      0,
    );

    return {
      categories: productSections.length,
      products: products.length,
      activeProducts: activeProducts.length,
      hiddenProducts: hiddenProducts.length,
      accountStock,
    };
  }, [productSections]);

  const stats = [
    {
      label: "Doanh thu",
      value: formatMoney(getValue(summary, "totalRevenue")),
      description: "Tổng doanh thu từ các đơn đã thanh toán.",
      icon: <DollarSign className="h-5 w-5" />,
      tone: "emerald",
    },
    {
      label: "Đơn đã thanh toán",
      value: getNumber(summary, "paidOrders"),
      description: "Các đơn sản phẩm đã ghi nhận thanh toán.",
      icon: <ReceiptText className="h-5 w-5" />,
      tone: "sky",
    },
    {
      label: "Tài khoản bán ra",
      value: getNumber(summary, "totalQuantity"),
      description: "Tổng số lượng account đã bán qua đơn hàng.",
      icon: <ShoppingCart className="h-5 w-5" />,
      tone: "amber",
    },
    {
      label: "Sản phẩm hoạt động",
      value: `${productMetrics.activeProducts}/${productMetrics.products}`,
      description: "Sản phẩm đang hiển thị so với tổng số sản phẩm.",
      icon: <PackageCheck className="h-5 w-5" />,
      tone: "slate",
    },
  ];

  const actions = [
    {
      as: Link,
      to: "/admin-product-list",
      label: "Quản lý gian hàng",
      description: "Sửa sản phẩm, trạng thái, kho và gói bán.",
      icon: <Store className="h-5 w-5" />,
      tone: "emerald",
    },
    {
      as: Link,
      to: "/admin-create-product",
      label: "Tạo sản phẩm",
      description: "Thêm sản phẩm hoặc dịch vụ mới vào shop.",
      icon: <PlusCircle className="h-5 w-5" />,
      tone: "sky",
    },
    {
      as: Link,
      to: "/admin/product-orders",
      label: "Đơn hàng",
      description: "Theo dõi giao dịch, doanh thu và trạng thái đơn.",
      icon: <ReceiptText className="h-5 w-5" />,
      tone: "amber",
    },
    {
      as: Link,
      to: "/admin/discounts",
      label: "Mã giảm giá",
      description: "Quản lý coupon và lượt sử dụng còn lại.",
      icon: <Tags className="h-5 w-5" />,
      tone: "slate",
    },
  ];

  const refreshDashboard = () => {
    ordersQuery.refetch();
    productsQuery.refetch();
  };

  return (
    <DashboardLayout>
      <DashboardHero
        eyebrow="Dashboard admin"
        title="Tổng quan quản trị"
        description="Một mặt bằng chung cho dashboard user và admin: cùng cấu trúc, riêng admin có bộ thao tác vận hành shop."
        icon={<ShieldCheck className="h-7 w-7" />}
        badges={["Admin", "Đơn hàng", "Sản phẩm", "Coupon"]}
        actions={
          <>
            <Button
              variant="ghost"
              leftIcon={<RefreshCcw className="h-4 w-4" />}
              onClick={refreshDashboard}
              isLoading={ordersQuery.isFetching || productsQuery.isFetching}
            >
              Làm mới
            </Button>
            <Link
              to="/user"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <UserCircle className="h-4 w-4" />
              Dashboard cá nhân
            </Link>
          </>
        }
      />

      <DashboardStats items={stats} />
      <DashboardActions items={actions} />

      <div className="grid gap-5 xl:grid-cols-12 xl:items-start">
        <DashboardPanel
          className="xl:col-span-7"
          title="Đơn hàng gần đây"
          description="5 đơn sản phẩm đã thanh toán gần nhất để admin nắm nhịp bán hàng."
          icon={<ReceiptText className="h-4 w-4" />}
          action={
            <Link
              to="/admin/product-orders"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Xem tất cả
            </Link>
          }
        >
          {ordersQuery.isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center text-sm font-medium text-slate-500">
              Đang tải đơn hàng...
            </div>
          ) : ordersQuery.isError ? (
            <div className="flex min-h-[220px] items-center justify-center text-center">
              <div>
                <BarChart3 className="mx-auto h-9 w-9 text-slate-300" />
                <h3 className="mt-3 text-base font-semibold text-slate-950">
                  Không thể tải dữ liệu đơn hàng
                </h3>
                <Button className="mt-4" onClick={() => ordersQuery.refetch()}>
                  Tải lại
                </Button>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center text-center">
              <div>
                <ReceiptText className="mx-auto h-9 w-9 text-slate-300" />
                <h3 className="mt-3 text-base font-semibold text-slate-950">
                  Chưa có đơn đã thanh toán
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Khi có đơn mới, hệ thống sẽ hiển thị nhanh tại đây.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <RecentOrderRow
                  key={getValue(order, "orderId") ?? getValue(order, "paymentTransactionCode")}
                  order={order}
                />
              ))}
            </div>
          )}
        </DashboardPanel>

        <div className="space-y-5 xl:col-span-5">
          <DashboardPanel
            title="Sức khỏe gian hàng"
            description="Các chỉ số gọn để admin ra quyết định nhanh."
            icon={<Store className="h-4 w-4" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Danh mục", productMetrics.categories],
                ["Tổng sản phẩm", productMetrics.products],
                ["Đang ẩn", productMetrics.hiddenProducts],
                ["Account trong kho", productMetrics.accountStock],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Luồng quản trị"
            description="Một layout, khác chức năng theo role. Admin có các lối vận hành shop, user có đơn hàng và bảo mật."
            icon={<BarChart3 className="h-4 w-4" />}
          >
            <div className="grid gap-2 text-sm">
              <Link
                to="/admin-product-list"
                className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Kiểm tra tồn kho và trạng thái sản phẩm
                <PackageCheck className="h-4 w-4" />
              </Link>
              <Link
                to="/admin/product-orders"
                className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
              >
                Đối soát doanh thu và đơn hàng
                <ReceiptText className="h-4 w-4" />
              </Link>
              <Link
                to="/product"
                className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
              >
                Xem storefront như khách hàng
                <Store className="h-4 w-4" />
              </Link>
            </div>
          </DashboardPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}
