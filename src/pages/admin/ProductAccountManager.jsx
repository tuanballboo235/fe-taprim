import React, { useEffect, useState } from "react";
import ProductSidebar from "../../components/admin/ProductAccount/ProductSidebar";
import AccountTable from "../../components/admin/ProductAccount/AccountTable";
// (tùy chọn): import AccountFormModal
import { useParams } from "react-router-dom";
import { getProductAccountFilter } from "../../services/api/productAccountService"; // giả định bạn có hàm này
import { getProductOptionByProductId } from "../../services/api/productService";

const ProductAccountManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productAccounts, setProductAccounts] = useState([]);
  const { productId } = useParams(); // 👈 lấy param từ URL
  const [isLoading, setIsLoading] = useState(false);

  const handleEditAccount = (account) => {
    console.log("edit or create", account);
    // mở modal hoặc hiển thị form
  };

  //Get product account
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getProductOptionByProductId(productId);
      const items = res.data?.productOptions || [];
      setProducts(items);
      console.log("Fetched products:", items);
      if (items.length > 0) {
        setSelectedProduct(items[0]);
        console.log("productOption:", items[0].productOptionId);
      }
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
    }
  };
  fetchData();
}, [productId]);


  //Get product options list
useEffect(() => {
  const fetchData2 = async () => {
    if (!selectedProduct?.productOptionId) return;

    try {
      setIsLoading(true); // 👉 bắt đầu loading
      const res = await getProductAccountFilter({
        productOptionId: selectedProduct.productOptionId,
      });
      const items = res.data?.items || [];
      setProductAccounts(items);
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
    } finally {
      setIsLoading(false); // 👉 kết thúc loading dù có lỗi hay không
    }
  };
  fetchData2();
}, [selectedProduct]);


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
        selectedProductId={selectedProduct?.productOptionId}
      />
      <AccountTable
        accounts={productAccounts || []}
        onEdit={handleEditAccount}
        isLoading={isLoading}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default ProductAccountManager;
