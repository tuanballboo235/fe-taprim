import React, { useState } from "react";
import ProductSidebar from "../../components/admin/ProductAccount/ProductSidebar";
import AccountTable from "../../components/admin/ProductAccount/AccountTable";
// (tùy chọn): import AccountFormModal

const mockProducts = [
  { id: 1, name: "Quizlet Plus", accounts: [ { id: 1, email: "a@a.com", password: "123456" } ] },
  { id: 2, name: "Netflix", accounts: [] },
  { id: 3, name: "Canva Pro", accounts: [] },
];

const ProductAccountManager = () => {
  const [products, setProducts] = useState(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleEditAccount = (account) => {
    console.log("edit or create", account);
    // mở modal hoặc hiển thị form
  };

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
