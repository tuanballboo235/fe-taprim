import Button from "@/shared/components/Button";

const fieldClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600";

const ProductAccountForm = ({ form, onChange, onSubmit, isSubmitting = false }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Thong tin tai khoan
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
            Ten dang nhap
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
            Mat khau
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
            Ngay doi mat khau
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
            So lan ban
          </span>
          <input
            type="number"
            name="sellCount"
            value={form.sellCount}
            onChange={onChange}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Trang thai
          </span>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className={fieldClass}
          >
            <option value="0">Chua ban</option>
            <option value="1">Da ban</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Bat dau ban tu
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
            Ban den
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
          {isSubmitting ? "Dang them..." : "Them tai khoan"}
        </Button>
      </div>
    </form>
  );
};

export default ProductAccountForm;
