import Button from "@/shared/components/Button";

const fieldClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600";

const ProductAccountForm = ({ form, onChange, onSubmit, isSubmitting = false }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Dữ liệu account
          </span>
          <input
            type="text"
            name="accountData"
            value={form.accountData}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Email đăng nhập
          </span>
          <input
            type="text"
            name="usernameProductAccount"
            value={form.usernameProductAccount}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Mật khẩu
          </span>
          <input
            type="text"
            name="passwordProductAccount"
            value={form.passwordProductAccount}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Ngày đổi mật khẩu
          </span>
          <input
            type="datetime-local"
            name="dateChangePass"
            value={form.dateChangePass}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Lượt bán còn
          </span>
          <input
            type="number"
            name="sellCount"
            min={0}
            value={form.sellCount}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Trạng thái
          </span>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className={fieldClass}
          >
            <option value="1">Đang bán</option>
            <option value="0">Chưa sử dụng</option>
            <option value="2">Hết hạn</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Bắt đầu bán từ
          </span>
          <input
            type="datetime-local"
            name="sellDateFrom"
            value={form.sellDateFrom}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Bán đến
          </span>
          <input
            type="datetime-local"
            name="sellDateTo"
            value={form.sellDateTo}
            onChange={onChange}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="info" isLoading={isSubmitting}>
          {isSubmitting ? "Đang thêm..." : "Thêm tài khoản"}
        </Button>
      </div>
    </form>
  );
};

export default ProductAccountForm;
