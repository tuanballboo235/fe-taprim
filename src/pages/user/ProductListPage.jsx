import React, { useEffect, useState } from "react";
import CategorySection from "../../components/category/CategorySection";
import AdminProductTable from "../../components/admin/Product/AdminProductTable";
import { getProductByCategory } from "../../services/api/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const mockData1 = [
  {
    id: 1,
    shopName: 'Gian hàng A',
    resellerType: 'Cộng tác viên',
    price: '200.000',
    platform: 'Shopee',
    stock: 10,
    createdAt: '11/07/2025',
    status: 'active'
  },
  {
    id: 2,
    shopName: 'Gian hàng B',
    resellerType: 'Đại lý',
    price: '350.000',
    platform: 'Lazada',
    stock: 0,
    createdAt: '10/07/2025',
    status: 'inactive'
  }
];
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
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Danh sách gian hàng</h1>
      <AdminProductTable data={mockData1} />
    </div>
  );
};

export default ProductList;
