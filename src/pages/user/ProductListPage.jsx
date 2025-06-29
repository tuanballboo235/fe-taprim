import React, { useEffect, useState } from "react";
import CategorySection from "../../components/category/CategorySection";
import { getProductByCategory } from "../../services/api/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductByCategory();
        setMockData(data.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("❌ Lỗi khi tải danh sách sản phẩm");
      }
    };

    fetchData();
  }, []);



  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="mb-6">
       
      </div>

      {mockData.map((section) => (
        <CategorySection
          key={section.title}
          title={section.title}
          description={section.description}
          products={section.products}
        />
      ))}
    </div>
  );
};

export default ProductList;
