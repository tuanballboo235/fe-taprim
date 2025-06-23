const ProductForm = ({ form, onChange, onFileChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input name="ProductName" value={form.ProductName} onChange={onChange} placeholder="Tên sản phẩm" className="input" />
    <input name="ProductCode" value={form.ProductCode} onChange={onChange} placeholder="Mã sản phẩm" className="input" />
    <input name="Price" type="number" value={form.Price} onChange={onChange} placeholder="Giá" className="input" />
    <input name="DurationDay" type="number" value={form.DurationDay} onChange={onChange} placeholder="Thời hạn (ngày)" className="input" />
    <input name="DiscountPercentDisplay" type="number" value={form.DiscountPercentDisplay} onChange={onChange} placeholder="Giảm giá (%)" className="input" />
    <textarea name="AttentionNote" value={form.AttentionNote} onChange={onChange} placeholder="Ghi chú" className="input" />
    <select name="Status" value={form.Status} onChange={onChange} className="input">
      <option value="1">Hiển thị</option>
      <option value="0">Ẩn</option>
    </select>
    <input name="CategoryId" value={form.CategoryId} onChange={onChange} placeholder="Danh mục ID" className="input" />
    <textarea name="Description" value={form.Description} onChange={onChange} placeholder="Mô tả chi tiết" className="input" />
    <input type="file" accept="image/*" onChange={onFileChange} className="input" />
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Tạo sản phẩm</button>
  </form>
);
