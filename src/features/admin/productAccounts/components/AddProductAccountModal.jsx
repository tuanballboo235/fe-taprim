import { useEffect, useState } from "react";
import Button from "@/shared/components/Button";
import notify from "@/shared/utils/notify";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600";
const labelClass = "mb-1 block text-sm font-semibold text-slate-700";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[^\s:]+$/;

const credentialTypeConfig = {
  email: {
    label: "Email:password",
    format: "email:password",
    placeholder: "email@example.com:password",
    multiPlaceholder: "abc1@gmail.com:pass123\nabc2@gmail.com:pass456",
    help: "Email phải hợp lệ và mật khẩu không được để trống.",
    invalidText: "không đúng định dạng email:password hoặc email không hợp lệ",
  },
  username: {
    label: "User:password",
    format: "user:password",
    placeholder: "username:password",
    multiPlaceholder: "user01:pass123\nuser02:pass456",
    help: "User không được chứa khoảng trắng hoặc dấu hai chấm, mật khẩu không được để trống.",
    invalidText: "không đúng định dạng user:password",
  },
  linkInvite: {
    label: "Link invite",
    format: "Nhập định dạng link mời",
    placeholder: "https://example.com/invite/abc123",
    multiPlaceholder:
      "https://example.com/invite/abc123\nhttps://example.com/invite/def456",
    help: "Nhập link mời hợp lệ.",
    invalidText: "không đúng định dạng link mời",
  },
};

const toDateInput = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime()))
    return new Date().toISOString().split("T")[0];

  return date.toISOString().split("T")[0];
};

const toDateTimeInput = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime()))
    return new Date().toISOString().slice(0, 16);

  return date.toISOString().slice(0, 16);
};

const addDaysSafe = (from, days) => {
  const base =
    from && !Number.isNaN(new Date(from).getTime())
      ? new Date(from)
      : new Date();
  const date = new Date(base);
  date.setDate(date.getDate() + Number(days || 0));

  return date.toISOString().split("T")[0];
};

const createSingleForm = () => {
  const today = toDateInput();

  return {
    accountData: "",
    dateChangePass: toDateTimeInput(),
    sellCount: 1,
    sellDateFrom: today,
    sellDateTo: addDaysSafe(today, 1),
    status: 1,
    customDays: "1",
  };
};

const createMultiDefaults = () => {
  const today = toDateInput();

  return {
    dateChangePass: toDateTimeInput(),
    sellCount: 1,
    sellDateFrom: today,
    sellDateTo: addDaysSafe(today, 1),
    status: 1,
    customDays: "1",
  };
};

const parseCredential = (value, credentialType = "email") => {
  const trimmed = value.trim();
  const separatorIndex = trimmed.indexOf(":");

  if (separatorIndex <= 0 || separatorIndex === trimmed.length - 1) {
    return null;
  }

  const username = trimmed.slice(0, separatorIndex).trim();
  const password = trimmed.slice(separatorIndex + 1).trim();
  const isEmailCredential = credentialType === "email";

  if (!username || !password) return null;
  if (isEmailCredential && !emailPattern.test(username)) return null;
  if (!isEmailCredential && !usernamePattern.test(username)) return null;

  return {
    username,
    password,
    accountData: `${username}:${password}`,
  };
};

const buildAccountPayload = (account, defaults = {}) => ({
  accountData: account.accountData,
  usernameProductAccount: account.usernameProductAccount,
  passwordProductAccount: account.passwordProductAccount,
  dateChangePass: account.dateChangePass ?? defaults.dateChangePass,
  sellCount: account.sellCount ?? defaults.sellCount ?? 1,
  sellDateFrom: account.sellDateFrom ?? defaults.sellDateFrom,
  sellDateTo: account.sellDateTo ?? defaults.sellDateTo,
  status: account.status ?? defaults.status,
});

const AddProductAccountModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [multiInput, setMultiInput] = useState("");
  const [form, setForm] = useState(createSingleForm);
  const [multiDefaults, setMultiDefaults] = useState(createMultiDefaults);
  const [credentialType, setCredentialType] = useState("email");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(initialData);
  const credentialConfig = credentialTypeConfig[credentialType];

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const from = toDateInput(
        initialData.sellDateFrom ?? initialData.sellFrom,
      );
      const to = toDateInput(
        initialData.sellDateTo ?? initialData.sellTo ?? from,
      );
      const fallbackAccountData =
        initialData.usernameProductAccount && initialData.passwordProductAccount
          ? `${initialData.usernameProductAccount}:${initialData.passwordProductAccount}`
          : "";

      setForm({
        accountData: initialData.accountData ?? fallbackAccountData,
        dateChangePass: toDateTimeInput(initialData.dateChangePass),
        sellCount: initialData.sellCount ?? 1,
        sellDateFrom: from,
        sellDateTo: to,
        status: initialData.status ?? 1,
        customDays: "",
      });
      setCredentialType(
        emailPattern.test(initialData.usernameProductAccount ?? "")
          ? "email"
          : "username",
      );
      setActiveTab("single");
      return;
    }

    setForm(createSingleForm());
    setMultiDefaults(createMultiDefaults());
    setMultiInput("");
    setCredentialType("email");
    setActiveTab("single");
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

  const buildSinglePayload = () => {
    const account = parseCredential(form.accountData, credentialType);

    if (!account) return null;

    return buildAccountPayload({
      ...form,
      accountData: account.accountData,
      usernameProductAccount: account.username,
      passwordProductAccount: account.password,
    });
  };

  const parseMultiInput = () => {
    const invalidLines = [];
    const accounts = multiInput
      .split("\n")
      .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
      .filter(({ line }) => Boolean(line))
      .map(({ line, lineNumber }) => {
        const credential = parseCredential(line, credentialType);

        if (!credential) {
          invalidLines.push(lineNumber);
          return null;
        }

        return buildAccountPayload(
          {
            accountData: credential.accountData,
            usernameProductAccount: credential.username,
            passwordProductAccount: credential.password,
          },
          multiDefaults,
        );
      })
      .filter(Boolean);

    return { accounts, invalidLines };
  };

  const handleSubmit = async () => {
    const payload =
      activeTab === "single" ? buildSinglePayload() : parseMultiInput();

    if (activeTab === "single" && !payload) {
      notify.warning(
        `Vui lòng nhập đúng định dạng ${credentialTypeConfig[credentialType].format}.`,
      );
      return;
    }

    if (activeTab === "multi") {
      if (payload.invalidLines.length > 0) {
        notify.warning(
          `Dòng ${payload.invalidLines.join(", ")} ${credentialTypeConfig[credentialType].invalidText}.`,
        );
        return;
      }

      if (payload.accounts.length === 0) {
        notify.warning("Vui lòng nhập ít nhất một account.");
        return;
      }
    }

    setIsSaving(true);

    try {
      await onSave?.(activeTab === "single" ? [payload] : payload.accounts);
      onClose?.();
    } catch {
      return;
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
            {isEditing ? "Cập nhật account sản phẩm" : "Thêm account sản phẩm"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Chỉnh sửa dữ liệu account, thời gian bán, lượt bán còn và trạng thái."
              : "Thêm từng account hoặc dán danh sách theo định dạng email:password hoặc user:password."}
          </p>
        </div>

        {!isEditing && (
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
                Thêm 1 account
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
                Thêm nhiều account
              </button>
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <span className={labelClass}>Kiểu tài khoản</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(credentialTypeConfig).map(([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCredentialType(type)}
                  className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                    credentialType === type
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-600 hover:border-blue-300"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "single" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className={labelClass}>Tài khoản</span>
                <input
                  type="text"
                  name="accountData"
                  value={form.accountData}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={credentialConfig.placeholder}
                />
                <span className="mt-1 block text-xs text-slate-500">
                  Nhập đúng định dạng {credentialConfig.format}.{" "}
                  {credentialConfig.help}
                </span>
              </label>

              <label>
                <span className={labelClass}>Ngày đổi mật khẩu</span>
                <input
                  type="datetime-local"
                  name="dateChangePass"
                  value={form.dateChangePass}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Lượt bán còn</span>
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
                <span className={labelClass}>Thời gian bán</span>
                <div className="mb-2 flex flex-wrap gap-2">
                  {[1, 2, 3].map((days) => (
                    <Button
                      key={days}
                      size="sm"
                      variant="muted"
                      onClick={() => handleQuickSelect(days)}
                    >
                      +{days} ngày
                    </Button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    placeholder="Tùy chỉnh"
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
                <span className={labelClass}>Trạng thái</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value={1}>Đang bán</option>
                  <option value={0}>Chưa sử dụng</option>
                  <option value={2}>Hết hạn</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label>
                <span className={labelClass}>
                  Danh sách account, mỗi dòng đúng định dạng{" "}
                  {credentialConfig.format}
                </span>
                <textarea
                  value={multiInput}
                  onChange={(event) => setMultiInput(event.target.value)}
                  rows={8}
                  placeholder={credentialConfig.multiPlaceholder}
                  className={`${inputClass} font-mono`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Ngày đổi mật khẩu</span>
                  <input
                    type="datetime-local"
                    name="dateChangePass"
                    value={multiDefaults.dateChangePass}
                    onChange={handleChangeMultiDefaults}
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className={labelClass}>Lượt bán còn</span>
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
                <span className={labelClass}>Thời gian bán mặc định</span>
                <div className="mb-2 flex flex-wrap gap-2">
                  {[1, 2, 3].map((days) => (
                    <Button
                      key={days}
                      size="sm"
                      variant="muted"
                      onClick={() => handleQuickSelectMulti(days)}
                    >
                      +{days} ngày
                    </Button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    placeholder="Tùy chỉnh"
                    value={multiDefaults.customDays}
                    onChange={(event) =>
                      handleQuickSelectMulti(event.target.value)
                    }
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
                <span className={labelClass}>Trạng thái mặc định</span>
                <select
                  name="status"
                  value={multiDefaults.status}
                  onChange={handleChangeMultiDefaults}
                  className={inputClass}
                >
                  <option value={1}>Đang bán</option>
                  <option value={0}>Chưa sử dụng</option>
                  <option value={2}>Hết hạn</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Hủy
          </Button>
          <Button variant="info" onClick={handleSubmit} isLoading={isSaving}>
            {isEditing
              ? "Cập nhật account"
              : activeTab === "single"
                ? "Thêm account"
                : "Lưu danh sách"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductAccountModal;
