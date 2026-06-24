import { useEffect, useState } from "react";
import Button from "@/shared/components/Button";
import notify from "@/shared/utils/notify";

const getToday = () => new Date().toISOString().split("T")[0];
const getDateTimeLocal = () => new Date().toISOString().slice(0, 16);

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600";
const labelClass = "mb-1 block text-sm font-semibold text-slate-700";

const createSingleForm = () => {
  const today = getToday();

  return {
    accountData: "",
    usernameProductAccount: "",
    passwordProductAccount: "",
    dateChangePass: getDateTimeLocal(),
    sellCount: 1,
    sellDateFrom: today,
    sellDateTo: today,
    status: 0,
    customDays: "",
  };
};

const createMultiDefaults = () => {
  const today = getToday();

  return {
    dateChangePass: getDateTimeLocal(),
    sellCount: 0,
    sellDateFrom: today,
    sellDateTo: today,
    status: 0,
    customDays: "",
  };
};

const addDaysSafe = (from, days) => {
  const base =
    from && !Number.isNaN(new Date(from).getTime()) ? new Date(from) : new Date();
  const date = new Date(base);
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().split("T")[0];
};

const AddProductAccountModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [multiInput, setMultiInput] = useState("");
  const [form, setForm] = useState(createSingleForm);
  const [multiDefaults, setMultiDefaults] = useState(createMultiDefaults);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const today = getToday();
      const from = initialData.sellDateFrom ?? initialData.sellFrom ?? today;
      const to = initialData.sellDateTo ?? initialData.sellTo ?? from;

      setForm({
        accountData: initialData.accountData ?? "",
        usernameProductAccount: initialData.usernameProductAccount ?? "",
        passwordProductAccount:
          initialData.passwordProductAccount ?? initialData.password ?? "",
        dateChangePass: initialData.dateChangePass ?? getDateTimeLocal(),
        sellCount: initialData.sellCount ?? 0,
        sellDateFrom: from,
        sellDateTo: to,
        status: initialData.status ?? 0,
        customDays: "",
      });
    } else {
      setForm(createSingleForm());
      setMultiDefaults(createMultiDefaults());
      setMultiInput("");
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!form.customDays) return;

    setForm((current) => ({
      ...current,
      sellDateTo: addDaysSafe(current.sellDateFrom, Number(current.customDays)),
    }));
  }, [form.sellDateFrom, form.customDays]);

  useEffect(() => {
    if (!multiDefaults.customDays) return;

    setMultiDefaults((current) => ({
      ...current,
      sellDateTo: addDaysSafe(current.sellDateFrom, Number(current.customDays)),
    }));
  }, [multiDefaults.sellDateFrom, multiDefaults.customDays]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "sellCount" || name === "status" ? Number(value) : value,
    }));
  };

  const handleChangeMultiDefaults = (event) => {
    const { name, value } = event.target;

    setMultiDefaults((current) => ({
      ...current,
      [name]: name === "sellCount" || name === "status" ? Number(value) : value,
    }));
  };

  const handleQuickSelect = (days) => {
    if (!days || Number.isNaN(Number(days))) {
      setForm((current) => ({ ...current, customDays: "" }));
      return;
    }

    setForm((current) => ({
      ...current,
      customDays: String(days),
      sellDateTo: addDaysSafe(current.sellDateFrom, Number(days)),
    }));
  };

  const handleQuickSelectMulti = (days) => {
    if (!days || Number.isNaN(Number(days))) {
      setMultiDefaults((current) => ({ ...current, customDays: "" }));
      return;
    }

    setMultiDefaults((current) => ({
      ...current,
      customDays: String(days),
      sellDateTo: addDaysSafe(current.sellDateFrom, Number(days)),
    }));
  };

  const parseMultiInput = () =>
    multiInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [accountData, username, password] = line.split(",");

        return {
          accountData: accountData?.trim() || "",
          usernameProductAccount: username?.trim() || "",
          passwordProductAccount: password?.trim() || "",
          dateChangePass: multiDefaults.dateChangePass,
          sellCount: multiDefaults.sellCount,
          sellDateFrom: multiDefaults.sellDateFrom,
          sellDateTo: multiDefaults.sellDateTo,
          status: multiDefaults.status,
        };
      })
      .filter((account) => account.accountData);

  const handleSubmit = async () => {
    const payload = activeTab === "single" ? form : parseMultiInput();

    if (activeTab === "single" && !form.accountData.trim()) {
      notify.warning("Vui long nhap account data.");
      return;
    }

    if (activeTab === "multi" && payload.length === 0) {
      notify.warning("Vui long nhap it nhat mot account hop le.");
      return;
    }

    setIsSaving(true);

    try {
      await onSave?.(payload);
      onClose?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Them account san pham
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Nhap tung account hoac dan danh sach theo tung dong.
          </p>
        </div>

        <div className="border-b border-slate-200 px-4 pt-3 sm:px-5">
          <div className="flex gap-2">
            <button
              type="button"
              className={`border-b-2 px-3 py-2 text-sm font-semibold transition ${
                activeTab === "single"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("single")}
            >
              Them 1 account
            </button>
            <button
              type="button"
              className={`border-b-2 px-3 py-2 text-sm font-semibold transition ${
                activeTab === "multi"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("multi")}
            >
              Them nhieu account
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === "single" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className={labelClass}>Account data</span>
                <input
                  type="text"
                  name="accountData"
                  value={form.accountData}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="email@example.com"
                />
              </label>

              <label>
                <span className={labelClass}>Ten dang nhap</span>
                <input
                  type="text"
                  name="usernameProductAccount"
                  value={form.usernameProductAccount}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Mat khau</span>
                <input
                  type="text"
                  name="passwordProductAccount"
                  value={form.passwordProductAccount}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Ngay doi mat khau</span>
                <input
                  type="datetime-local"
                  name="dateChangePass"
                  value={form.dateChangePass}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Luot ban con</span>
                <input
                  type="number"
                  name="sellCount"
                  min={0}
                  value={form.sellCount}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <div className="sm:col-span-2">
                <span className={labelClass}>Thoi gian ban</span>
                <div className="mb-2 flex flex-wrap gap-2">
                  {[1, 2, 3].map((days) => (
                    <Button
                      key={days}
                      size="sm"
                      variant="muted"
                      onClick={() => handleQuickSelect(days)}
                    >
                      +{days} ngay
                    </Button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    placeholder="Tuy chinh"
                    value={form.customDays}
                    onChange={(event) => handleQuickSelect(event.target.value)}
                    className="w-28 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    name="sellDateFrom"
                    value={form.sellDateFrom}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="date"
                    name="sellDateTo"
                    value={form.sellDateTo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="sm:col-span-2">
                <span className={labelClass}>Trang thai</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value={0}>Chua su dung</option>
                  <option value={1}>Da ban</option>
                  <option value={2}>Het han</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label>
                <span className={labelClass}>
                  Danh sach account, moi dong: accountData,username,password
                </span>
                <textarea
                  value={multiInput}
                  onChange={(event) => setMultiInput(event.target.value)}
                  rows={8}
                  placeholder={"abc1@gmail.com,abc1,pass123\nabc2@gmail.com,abc2,pass456"}
                  className={`${inputClass} font-mono`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Ngay doi mat khau</span>
                  <input
                    type="datetime-local"
                    name="dateChangePass"
                    value={multiDefaults.dateChangePass}
                    onChange={handleChangeMultiDefaults}
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className={labelClass}>Luot ban con</span>
                  <input
                    type="number"
                    name="sellCount"
                    min={0}
                    value={multiDefaults.sellCount}
                    onChange={handleChangeMultiDefaults}
                    className={inputClass}
                  />
                </label>
              </div>

              <div>
                <span className={labelClass}>Thoi gian ban mac dinh</span>
                <div className="mb-2 flex flex-wrap gap-2">
                  {[1, 2, 3].map((days) => (
                    <Button
                      key={days}
                      size="sm"
                      variant="muted"
                      onClick={() => handleQuickSelectMulti(days)}
                    >
                      +{days} ngay
                    </Button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    placeholder="Tuy chinh"
                    value={multiDefaults.customDays}
                    onChange={(event) => handleQuickSelectMulti(event.target.value)}
                    className="w-28 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    name="sellDateFrom"
                    value={multiDefaults.sellDateFrom}
                    onChange={handleChangeMultiDefaults}
                    className={inputClass}
                  />
                  <input
                    type="date"
                    name="sellDateTo"
                    value={multiDefaults.sellDateTo}
                    onChange={handleChangeMultiDefaults}
                    className={inputClass}
                  />
                </div>
              </div>

              <label>
                <span className={labelClass}>Trang thai mac dinh</span>
                <select
                  name="status"
                  value={multiDefaults.status}
                  onChange={handleChangeMultiDefaults}
                  className={inputClass}
                >
                  <option value={0}>Chua su dung</option>
                  <option value={1}>Da ban</option>
                  <option value={2}>Het han</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Huy
          </Button>
          <Button variant="info" onClick={handleSubmit} isLoading={isSaving}>
            {activeTab === "single" ? "Luu account" : "Luu danh sach"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductAccountModal;
