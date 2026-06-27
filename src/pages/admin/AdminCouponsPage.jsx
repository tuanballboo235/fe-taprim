import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Percent,
  Plus,
  RefreshCcw,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "@/features/coupons/api/couponService";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const emptyForm = {
  couponCode: "",
  discountPercent: "",
  remainTurn: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
};

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600";

function unwrapData(response) {
  return response?.data ?? response?.Data ?? [];
}

function toDateTimeInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
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

function getCouponId(coupon) {
  return coupon.couponId ?? coupon.CouponId;
}

function getCouponValue(coupon, key) {
  const pascalKey = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  return coupon[key] ?? coupon[pascalKey];
}

function CouponFormModal({ coupon, onClose, onSaved }) {
  const [form, setForm] = useState(() => {
    if (!coupon) return emptyForm;

    return {
      couponCode: getCouponValue(coupon, "couponCode") ?? "",
      discountPercent: getCouponValue(coupon, "discountPercent") ?? "",
      remainTurn: getCouponValue(coupon, "remainTurn") ?? "",
      validFrom: toDateTimeInput(getCouponValue(coupon, "validFrom")),
      validUntil: toDateTimeInput(getCouponValue(coupon, "validUntil")),
      isActive: Boolean(getCouponValue(coupon, "isActive")),
    };
  });
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(coupon);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      couponCode: form.couponCode.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      remainTurn: Number(form.remainTurn),
      validFrom: form.validFrom || null,
      validUntil: form.validUntil || null,
      isActive: form.isActive,
    };

    if (!payload.couponCode) {
      notify.warning("Vui lòng nhập mã giảm giá.");
      return;
    }

    if (payload.discountPercent <= 0 || payload.discountPercent > 100) {
      notify.warning("Phần trăm giảm giá phải từ 1 đến 100.");
      return;
    }

    if (payload.remainTurn < 0 || Number.isNaN(payload.remainTurn)) {
      notify.warning("Lượt sử dụng còn lại không hợp lệ.");
      return;
    }

    try {
      setSaving(true);
      const response = isEditing
        ? await updateCoupon(getCouponId(coupon), payload)
        : await createCoupon(payload);

      notify.success(response?.message ?? "Đã lưu mã giảm giá.");
      onSaved();
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Không thể lưu mã giảm giá.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-xl"
      >
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            {isEditing ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Thiết lập thời gian hiệu lực, phần trăm giảm và số lượt sử dụng.
          </p>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <label className="text-sm font-medium text-slate-700">
            Mã giảm giá
            <input
              value={form.couponCode}
              maxLength={10}
              onChange={(event) =>
                updateField("couponCode", event.target.value.toUpperCase())
              }
              className={`${inputClass} mt-1 font-mono uppercase`}
              placeholder="SAVE10"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Phần trăm giảm
            <input
              type="number"
              min="1"
              max="100"
              value={form.discountPercent}
              onChange={(event) =>
                updateField("discountPercent", event.target.value)
              }
              className={`${inputClass} mt-1`}
              placeholder="10"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Lượt còn lại
            <input
              type="number"
              min="0"
              value={form.remainTurn}
              onChange={(event) =>
                updateField("remainTurn", event.target.value)
              }
              className={`${inputClass} mt-1`}
              placeholder="100"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Trạng thái
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(event) =>
                updateField("isActive", event.target.value === "true")
              }
              className={`${inputClass} mt-1`}
            >
              <option value="true">Đang hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Bắt đầu
            <input
              type="datetime-local"
              value={form.validFrom}
              onChange={(event) => updateField("validFrom", event.target.value)}
              className={`${inputClass} mt-1`}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Hết hạn
            <input
              type="datetime-local"
              value={form.validUntil}
              onChange={(event) =>
                updateField("validUntil", event.target.value)
              }
              className={`${inputClass} mt-1`}
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" isLoading={saving}>
            {saving ? "Đang lưu..." : "Lưu mã"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminCouponsPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);

  const filters = useMemo(
    () => ({
      keyword: debouncedKeyword.trim(),
      isActive: status === "all" ? undefined : status === "active",
    }),
    [debouncedKeyword, status]
  );

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCoupons(filters);
      setCoupons(unwrapData(response));
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Không thể tải danh sách mã giảm giá.")
      );
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(false);
  };

  const handleSaved = async () => {
    closeModal();
    await fetchCoupons();
  };

  const handleDelete = async (coupon) => {
    const confirmed = await notify.confirm({
      title: "Xóa mã giảm giá?",
      text: "Mã sẽ được vô hiệu hóa và không thể áp dụng cho đơn mới.",
      confirmButtonText: "Xóa",
    });

    if (!confirmed) return;

    try {
      const response = await deleteCoupon(getCouponId(coupon));
      notify.success(response?.message ?? "Đã xóa mã giảm giá.");
      await fetchCoupons();
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Không thể xóa mã giảm giá.")
      );
    }
  };

  const activeCount = coupons.filter((coupon) =>
    Boolean(getCouponValue(coupon, "isActive"))
  ).length;
  const remainTurnCount = coupons.reduce(
    (total, coupon) => total + Number(getCouponValue(coupon, "remainTurn") || 0),
    0
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-green-700">
            Quản trị khuyến mãi
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Mã giảm giá
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo, cập nhật, vô hiệu hóa và theo dõi hiệu lực mã giảm giá.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="ghost"
            onClick={fetchCoupons}
            isLoading={loading}
            leftIcon={<RefreshCcw className="h-4 w-4" />}
          >
            Làm mới
          </Button>
          <Button
            onClick={openCreateModal}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Thêm mã
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Tổng mã</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {coupons.length}
              </p>
            </div>
            <Tag className="h-8 w-8 text-green-700" />
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Đang hoạt động</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {activeCount}
              </p>
            </div>
            <Percent className="h-8 w-8 text-blue-700" />
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Tổng lượt còn lại</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {remainTurnCount}
              </p>
            </div>
            <RefreshCcw className="h-8 w-8 text-orange-700" />
          </div>
        </article>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="text-sm font-medium text-slate-700">
            Tìm kiếm
            <span className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Nhập mã giảm giá"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Trạng thái
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={`${inputClass} mt-1`}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <PageState
          type="loading"
          title="Đang tải mã giảm giá"
          description="Vui lòng đợi trong giây lát."
        />
      ) : coupons.length === 0 ? (
        <PageState
          type="empty"
          title="Chưa có mã giảm giá"
          description="Không có mã giảm giá nào khớp với bộ lọc hiện tại."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã</th>
                  <th className="px-4 py-3 font-semibold">Giảm</th>
                  <th className="px-4 py-3 font-semibold">Lượt còn</th>
                  <th className="px-4 py-3 font-semibold">Hiệu lực</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => {
                  const couponId = getCouponId(coupon);
                  const isActive = Boolean(getCouponValue(coupon, "isActive"));
                  const statusLabel =
                    getCouponValue(coupon, "statusLabel") ||
                    (isActive ? "Đang hiệu lực" : "Không hoạt động");

                  return (
                    <tr key={couponId} className="align-top hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm font-bold text-slate-900">
                          {getCouponValue(coupon, "couponCode")}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-700">
                        {getCouponValue(coupon, "discountPercent") ?? 0}%
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {getCouponValue(coupon, "remainTurn") ?? 0}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{formatDateTime(getCouponValue(coupon, "validFrom"))}</div>
                        <div className="text-xs text-slate-400">
                          đến {formatDateTime(getCouponValue(coupon, "validUntil"))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${
                            isActive
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-slate-200 bg-slate-50 text-slate-500"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(coupon)}
                            leftIcon={<Edit className="h-3.5 w-3.5" />}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(coupon)}
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
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
        </div>
      )}

      {isModalOpen && (
        <CouponFormModal
          coupon={editingCoupon}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
