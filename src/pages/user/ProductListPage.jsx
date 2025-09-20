import React, { useEffect, useState } from "react";
import { getProductByCategory } from "../../services/api/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategorySection from "../../components/user/category/CategorySection.jsx";

const ProductList = () => {
  const [mockData, setMockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ Thêm state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // ✅ Bắt đầu loading
        const data = await getProductByCategory();
        setMockData(data.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("❌ Lỗi khi tải danh sách sản phẩm");
      } finally {
        setIsLoading(false); // ✅ Kết thúc loading
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
        </div>
      ) : (
        <>
          {mockData.map((section) => (
            <CategorySection
              key={section.title}
              title={section.title}
              description={section.description}
              products={section.products}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ProductList;
