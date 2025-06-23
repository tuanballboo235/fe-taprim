// src/pages/product/ProductAccountPage.jsx
import React, { useState } from 'react';
import ProductAccountForm from '../../components/productAccount/ProductAccountForm';
import { addProductAccountToProduct } from '../../services/api/productAccountService';
const ProductAccountPage = ({ productId = 1 }) => {
  const [form, setForm] = useState({
    accountData: '',
    usernameProductAccount: '',
    passwordProductAccount: '',
    dateChangePass: new Date().toISOString().slice(0, 16),
    sellCount: 0,
    sellDateFrom: new Date().toISOString().slice(0, 16),
    sellDateTo: new Date().toISOString().slice(0, 16),
    status: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       await addProductAccountToProduct(productId, {
        accountData: form.accountData,
        usernameProductAccount: form.usernameProductAccount,
        passwordProductAccount: form.passwordProductAccount,
        dateChangePass: form.dateChangePass,
        sellCount: parseInt(form.sellCount, 10),
        sellDateFrom: form.sellDateFrom,
        sellDateTo: form.sellDateTo,
        status: parseInt(form.status, 10),
      });
      alert('Thêm tài khoản thành công');
    } catch (error) {
      console.error(error);
      alert('Thêm thất bại');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Thêm tài khoản sản phẩm</h2>
      <ProductAccountForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
  );
};

export default ProductAccountPage;
