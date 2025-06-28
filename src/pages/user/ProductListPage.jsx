import React, { useEffect, useState } from "react";
import CategorySection from "../../components/category/CategorySection";
import {getProductByCategory} from "../../services/api/productService";
const ProductList = () => {
  // Dữ liệu mẫu tĩnh cho từng danh mục
    const [mockData, setMockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductByCategory();
        setMockData(data.data);
        console.log("✅ Dữ liệu API:",data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
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
