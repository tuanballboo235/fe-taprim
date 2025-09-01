import React, { useState, useEffect } from "react";
import clsx from "clsx";

const AddProductAccountModal = ({ isOpen, onClose, onSave, initialData }) => {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const [activeTab, setActiveTab] = useState("single");
  const [multiInput, setMultiInput] = useState("");

  const [form, setForm] = useState({
    accountData: "",
    usernameProductAccount: "",
    passwordProductAccount: "",
    dateChangePass: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm
    sellCount: 1,
    sellDateFrom: today,
    sellDateTo: today,
    status: 0,
    customDays: "" // giữ string để dễ control input
  });

  // Hàm cộng ngày an toàn
  const addDaysSafe = (from, days) => {
    const base = from && !Number.isNaN(new Date(from).getTime()) ? new Date(from) : new Date();
    const d = new Date(base);
    d.setDate(d.getDate() + Number(days || 0));
    return d.toISOString().split("T")[0];
  };

  // Quick select số ngày
  const handleQuickSelect = (days) => {
    // nếu người dùng xoá ô tùy chỉnh -> không làm gì
    if (days === "" || days === null || Number.isNaN(Number(days))) {
      setForm((prev) => ({ ...prev, customDays: "" }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      customDays: String(days),
      sellDateTo: addDaysSafe(prev.sellDateFrom, Number(days)),
    }));
  };

  // Đồng bộ khi initialData / isOpen thay đổi
  useEffect(() => {
    if (initialData) {
      // đảm bảo có fallback cho ngày
      const from = initialData.sellDateFrom || today;
      const to = initialData.sellDateTo || from;
      setForm({
        accountData: initialData.accountData ?? "",
        usernameProductAccount: initialData.usernameProductAccount ?? "",
        passwordProductAccount: initialData.passwordProductAccount ?? "",
        dateChangePass: initialData.dateChangePass ?? new Date().toISOString().slice(0, 16),
        sellCount: initialData.sellCount ?? 0,
        sellDateFrom: from,
        sellDateTo: to,
        status: initialData.status ?? 0,
        customDays: ""
      });
    } else {
      // KHÔNG để rỗng: tránh Invalid Date
      setForm((prev) => ({
        ...prev,
        accountData: "",
        usernameProductAccount: "",
        passwordProductAccount: "",
        dateChangePass: new Date().toISOString().slice(0, 16),
        sellCount: 1,
        sellDateFrom: today,
        sellDateTo: today,
        status: 0,
        customDays: ""
      }));
    }
  }, [initialData, isOpen, today]);

  // Khi đổi sellDateFrom, nếu có customDays thì tính lại sellDateTo
  useEffect(() => {
    if (form.customDays) {
      setForm((prev) => ({
        ...prev,

        sellDateTo: addDaysSafe(prev.sellDateFrom, Number(prev.customDays)),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sellDateFrom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sellCount" || name === "status" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (activeTab === "single") {
      onSave(form);
    } else {
      const lines = multiInput.split("\n").filter((line) => line.trim() !== "");
      const accounts = lines.map((line) => {
        const [accountData, username, password] = line.split(",");
        return {
          accountData: accountData?.trim() || "",
          usernameProductAccount: username?.trim() || "",
          passwordProductAccount: password?.trim() || "",
          dateChangePass: new Date().toISOString().slice(0, 16),
          sellCount: 0,
          sellDateFrom: today,
          sellDateTo: today,
          status: 0,
          customDays: ""
        };
      });
      onSave(accounts);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Thêm tài khoản sản phẩm</h2>

        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={clsx(
              "px-4 py-2 text-sm font-medium",
              activeTab === "single"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            )}
            onClick={() => setActiveTab("single")}
          >
            ➕ Thêm 1 tài khoản
          </button>
          <button
            className={clsx(
              "px-4 py-2 text-sm font-medium ml-4",
              activeTab === "multi"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            )}
            onClick={() => setActiveTab("multi")}
          >
            📄 Thêm nhiều tài khoản
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "single" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Data</label>
              <input
                type="text"
                name="accountData"
                value={form.accountData}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                name="usernameProductAccount"
                value={form.usernameProductAccount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="text"
                name="passwordProductAccount"
                value={form.passwordProductAccount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đổi mật khẩu</label>
              <input
                type="datetime-local"
                name="dateChangePass"
                value={form.dateChangePass}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượt bán còn</label>
              <input
                type="number"
                name="sellCount"
                min={0}
                value={form.sellCount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bán</label>

              {/* Nhóm nút chọn nhanh (nhỏ, đặt trước) */}
              <div className="flex gap-2 mb-2">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleQuickSelect(d)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    +{d} ngày
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  placeholder="Tùy chỉnh"
                  value={form.customDays}
                  onChange={(e) => handleQuickSelect(e.target.value)}
                  className="w-24 border p-1 text-xs rounded"
                />
              </div>

              {/* chọn khoảng ngày */}
              <div className="flex gap-2">
                <input
                  type="date"
                  name="sellDateFrom"
                  value={form.sellDateFrom}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  type="date"
                  name="sellDateTo"
                  value={form.sellDateTo}
                  onChange={handleChange}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value={0}>Chưa sử dụng</option>
                <option value={1}>Đã bán</option>
                <option value={2}>Hết hạn</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập nhiều tài khoản (mỗi dòng: `accountData,username,password`)
            </label>
            <textarea
              value={multiInput}
              onChange={(e) => setMultiInput(e.target.value)}
              rows={8}
              placeholder={"Ví dụ:\nabc1@gmail.com,abc1,pass123\nabc2@gmail.com,abc2,pass456"}
              className="w-full border p-2 rounded font-mono"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {activeTab === "single" ? "Lưu tài khoản" : "Lưu nhiều tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductAccountModal;
