import React, { useEffect, useState } from "react";
import AdminProductTable from "../../components/admin/Product/AdminProductTable";
import { getProductByCategory } from "../../services/api/productService"; // giả định bạn có hàm này

const AdminProductPage = () => {
  const [productData, setProductData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductByCategory(); // gọi API từ service
        // giả sử API trả về mảng gồm cả product & service, ta tách ra theo CategoryId
        const productList = res.filter(p => p.CategoryId === 1); // ví dụ: sản phẩm
        const serviceList = res.filter(p => p.CategoryId === 2); // ví dụ: dịch vụ
        console.log("Dữ liệu sản phẩm:", productList);
        console.log("Dữ liệu dịch vụ:", serviceList);
        setProductData(productList);
        setServiceData(serviceList);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h1>
      <AdminProductTable data={productData} />

      <h1 className="text-xl font-semibold mt-8 mb-4">Danh sách dịch vụ</h1>
      <AdminProductTable data={serviceData} />
    </div>
  );
};

export default AdminProductPage;
