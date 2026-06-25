import Button from "@/shared/components/Button";

const ProductForm = ({
  form,
  onChange,
  onFileChange,
  onSubmit,
  isSubmitting = false,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <input
        name="ProductName"
        value={form.ProductName}
        onChange={onChange}
        placeholder="Tên sản phẩm"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
      />
      <input
        name="ProductCode"
        value={form.ProductCode}
        onChange={onChange}
        placeholder="Mã sản phẩm"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
      />
      <input
        name="Price"
        type="number"
        value={form.Price}
        onChange={onChange}
        placeholder="Giá"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
      />
      <input
        name="DurationDay"
        type="number"
        value={form.DurationDay}
        onChange={onChange}
        placeholder="Thời hạn (ngày)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
      />
      <input
        name="DiscountPercentDisplay"
        type="number"
        value={form.DiscountPercentDisplay}
        onChange={onChange}
        placeholder="Giảm giá (%)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
      />
      <select
        name="Status"
        value={form.Status}
        onChange={onChange}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
      >
        <option value="1">Hiển thị</option>
        <option value="0">Ẩn</option>
      </select>
      <input
        name="CategoryId"
        value={form.CategoryId}
        onChange={onChange}
        placeholder="Danh mục ID"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 md:col-span-2"
      />
    </div>
    <textarea
      name="AttentionNote"
      value={form.AttentionNote}
      onChange={onChange}
      placeholder="Ghi chú"
      className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
    />
    <textarea
      name="Description"
      value={form.Description}
      onChange={onChange}
      placeholder="Mô tả chi tiết"
      className="min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
    />
    <input
      type="file"
      accept="image/*"
      onChange={onFileChange}
      className="w-full rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm"
    />
    <div className="flex justify-end">
      <Button type="submit" variant="info" isLoading={isSubmitting}>
        {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
      </Button>
    </div>
  </form>
);

export default ProductForm;
