import { useState } from "react";
import ProductForm from "@/features/adminProducts/components/ProductForm";
import { useCreateProduct } from "@/features/adminProducts/hooks/useCreateProduct";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const initialForm = {
  ProductName: "",
  ProductCode: "",
  Price: "",
  DurationDay: "",
  DiscountPercentDisplay: "",
  AttentionNote: "",
  Status: "1",
  CategoryId: "",
  Description: "",
};

const AdminProductCreatePage = () => {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const createProduct = useCreateProduct();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("ProductImage", image);

    try {
      const response = await createProduct.mutateAsync(data);
      if (response.status !== "Success") {
        notify.error(response.message || "Lỗi khi tạo sản phẩm");
      } else {
        notify.success("Tạo sản phẩm thành công!");
        setForm(initialForm);
        setImage(null);
      }
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Lỗi khi tạo sản phẩm"));
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-slate-900">
          Thêm sản phẩm mới
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nhập thông tin sản phẩm và hình ảnh để hiển thị trên cửa hàng.
        </p>
      </div>
      <ProductForm
        form={form}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending}
      />
    </section>
  );
};

export default AdminProductCreatePage;
