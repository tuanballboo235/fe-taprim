import React from 'react';

const ProductAccountForm = ({ form, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      
      <div>
        <label htmlFor="accountData" className="block text-sm font-medium text-gray-700 mb-1">
          Thông tin tài khoản
        </label>
        <input
          id="accountData"
          type="text"
          name="accountData"
          value={form.accountData}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="usernameProductAccount" className="block text-sm font-medium text-gray-700 mb-1">
          Tên đăng nhập
        </label>
        <input
          id="usernameProductAccount"
          type="text"
          name="usernameProductAccount"
          value={form.usernameProductAccount}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="passwordProductAccount" className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <input
          id="passwordProductAccount"
          type="text"
          name="passwordProductAccount"
          value={form.passwordProductAccount}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="dateChangePass" className="block text-sm font-medium text-gray-700 mb-1">
          Ngày đổi mật khẩu
        </label>
        <input
          id="dateChangePass"
          type="datetime-local"
          name="dateChangePass"
          value={form.dateChangePass}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="sellCount" className="block text-sm font-medium text-gray-700 mb-1">
          Số lần bán
        </label>
        <input
          id="sellCount"
          type="number"
          name="sellCount"
          value={form.sellCount}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="sellDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
          Bắt đầu bán từ
        </label>
        <input
          id="sellDateFrom"
          type="datetime-local"
          name="sellDateFrom"
          value={form.sellDateFrom}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="sellDateTo" className="block text-sm font-medium text-gray-700 mb-1">
          Bán đến
        </label>
        <input
          id="sellDateTo"
          type="datetime-local"
          name="sellDateTo"
          value={form.sellDateTo}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="0">Chưa bán</option>
          <option value="1">Đã bán</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Thêm tài khoản sản phẩm
      </button>
    </form>
  );
};

export default ProductAccountForm;
