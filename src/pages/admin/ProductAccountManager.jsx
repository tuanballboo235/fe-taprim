import React, { useEffect, useState } from "react";
import ProductSidebar from "../../components/admin/ProductAccount/ProductSidebar";
import AccountTable from "../../components/admin/ProductAccount/AccountTable";
// (tùy chọn): import AccountFormModal
import { useParams } from "react-router-dom";
import { getProductAccountFilter } from "../../services/api/productAccountService"; // giả định bạn có hàm này
const mockProducts = [
  {
    id: 1,
    name: "Quizlet Plus",
    accounts: [{ id: 1, email: "a@a.com", password: "123456" }],
  },
  { id: 2, name: "Netflix", accounts: [] },
  { id: 3, name: "Canva Pro", accounts: [] },
];

const ProductAccountManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { productOptionId } = useParams(); // 👈 lấy param từ URL
  console.log("Selected Product Option ID:", productOptionId);
  const handleEditAccount = (account) => {
    console.log("edit or create", account);
    // mở modal hoặc hiển thị form
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProductAccountFilter({
          productOptionId: productOptionId,
        });
          var items = res.data?.items || [];
        setProducts(items);
        console.log("Fetched products:", items);
      
        // ✅ Chọn phần tử đầu tiên sau khi fetch xong
        if (items.length > 0) {
          setSelectedProduct(items[0]);
          console.log("lon hon 0");
        }else {
          console.log("Khong co san pham nao");
        }
      } catch (err) {
        console.error("Lỗi khi fetch:", err);
      }
    };

    fetchData();
  }, [productOptionId]);

  const handleDeleteAccount = (accId) => {
    const updated = products.map((prod) =>
      prod.id === selectedProduct.id
        ? {
            ...prod,
            accounts: prod.accounts.filter((acc) => acc.id !== accId),
          }
        : prod
    );
    setProducts(updated);
  };

  return (
    <div className="flex h-full">
      <ProductSidebar
        products={products}
        onSelect={setSelectedProduct}
        selectedProductId={selectedProduct?.id}
      />
      <AccountTable
        accounts={selectedProduct?.accounts || []}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default ProductAccountManager;
