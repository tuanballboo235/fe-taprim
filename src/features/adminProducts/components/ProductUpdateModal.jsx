import { useEffect, useMemo, useState } from "react";
import Button from "@/shared/components/Button";
import RichTextEditor from "@/shared/components/RichTextEditor";
import { getAssetUrl } from "@/shared/utils/apiEndpoint";
import { sanitizeRichTextHtml } from "@/shared/utils/richText";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600";
const labelClass = "mb-1 block text-sm font-semibold text-slate-700";

const buildInitialForm = (product) => ({
  ProductName: product?.productName ?? product?.name ?? "",
  CategoryId: String(product?.categoryId ?? ""),
  Status: String(product?.status ?? 1),
  Description: product?.description ?? "",
});

const ProductUpdateModal = ({
  isOpen,
  product,
  categories = [],
  isSubmitting = false,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(() => buildInitialForm(product));
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const currentImage = useMemo(
    () => product?.productImage ?? product?.image,
    [product],
  );

  const displayImage = imagePreview || (currentImage ? getAssetUrl(currentImage) : "");

  useEffect(() => {
    if (!isOpen) return;

    setForm(buildInitialForm(product));
    setImage(null);
    setImagePreview("");
  }, [isOpen, product]);

  useEffect(() => {
    if (!image) return undefined;

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleDescriptionChange = (description) => {
    setForm((current) => ({ ...current, Description: description }));
  };

  const handleFileChange = (event) => {
    setImage(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("ProductName", form.ProductName.trim());
    formData.append("CategoryId", form.CategoryId);
    formData.append("Status", form.Status);
    formData.append("Description", sanitizeRichTextHtml(form.Description));

    if (image) {
      formData.append("ProductImage", image);
    }

    onSave?.(formData);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Cập nhật sản phẩm
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật thông tin hiển thị của sản phẩm trong cửa hàng.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={labelClass}>Tên sản phẩm</span>
              <input
                name="ProductName"
                value={form.ProductName}
                onChange={handleChange}
                className={inputClass}
                required
                minLength={3}
                maxLength={100}
              />
            </label>

            <label>
              <span className={labelClass}>Danh mục</span>
              <select
                name="CategoryId"
                value={form.CategoryId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className={labelClass}>Trạng thái</span>
              <select
                name="Status"
                value={form.Status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="1">Hiển thị</option>
                <option value="0">Ẩn</option>
              </select>
            </label>

            <div className="sm:col-span-2">
              <span className={labelClass}>Mô tả</span>
              <RichTextEditor
                value={form.Description}
                onChange={handleDescriptionChange}
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>

            <div className="sm:col-span-2">
              <span className={labelClass}>Ảnh sản phẩm</span>
              <div className="grid gap-3 sm:grid-cols-[132px_1fr] sm:items-center">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-slate-50">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={form.ProductName}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Chưa có ảnh</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm"
                  />
                  {image && (
                    <p className="mt-2 text-xs font-medium text-green-700">
                      Ảnh mới: {image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="info" isLoading={isSubmitting}>
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateModal;