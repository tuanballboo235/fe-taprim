import React from 'react';

const ProductCreateForm = ({ form, onChange, onFileChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input
      name="ProductName"
      value={form.ProductName}
      onChange={onChange}
      placeholder="Tên sản phẩm"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <input
      name="ProductCode"
      value={form.ProductCode}
      onChange={onChange}
      placeholder="Mã sản phẩm"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <input
      name="Price"
      type="number"
      value={form.Price}
      onChange={onChange}
      placeholder="Giá"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <input
      name="DurationDay"
      type="number"
      value={form.DurationDay}
      onChange={onChange}
      placeholder="Thời hạn (ngày)"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <input
      name="DiscountPercentDisplay"
      type="number"
      value={form.DiscountPercentDisplay}
      onChange={onChange}
      placeholder="Giảm giá (%)"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <textarea
      name="AttentionNote"
      value={form.AttentionNote}
      onChange={onChange}
      placeholder="Ghi chú"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <select
      name="Status"
      value={form.Status}
      onChange={onChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    >
      <option value="1">Hiển thị</option>
      <option value="0">Ẩn</option>
    </select>
    <input
      name="CategoryId"
      value={form.CategoryId}
      onChange={onChange}
      placeholder="Danh mục ID"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <textarea
      name="Description"
      value={form.Description}
      onChange={onChange}
      placeholder="Mô tả chi tiết"
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <input
      type="file"
      accept="image/*"
      onChange={onFileChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md"
    />
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
    >
      Tạo sản phẩm
    </button>
  </form>
);

export default ProductCreateForm;
