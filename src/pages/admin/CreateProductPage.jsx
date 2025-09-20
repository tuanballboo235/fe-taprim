import React, { useState } from "react";
import ProductForm from "../../components/user/product/ProductCreateForm"; // Adjust the import path as needed
import { createProduct } from "../../services/api/productService"; // Adjust the import path as needed
const CreateProductPage = () => {
  const [form, setForm] = useState({
    ProductName: "",
    ProductCode: "",
    Price: "",
    DurationDay: "",
    DiscountPercentDisplay: "",
    AttentionNote: "",
    Status: "1",
    CategoryId: "",
    Description: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("ProductImage", image);

    try {
      console.log(
        "Submitting product data:",
        Object.fromEntries(data.entries())
      );
      const response = await createProduct(data);
      if (response.status !== "Success") {
        alert("Lỗi khi tạo sản phẩm");
      } else {
        alert("Tạo sản phẩm thành công!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo sản phẩm");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
      <ProductForm
        form={form}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateProductPage;
