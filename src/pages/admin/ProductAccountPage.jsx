import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductAccountForm from "../../components/productAccount/ProductAccountForm";
import { addProductAccountToProduct } from "../../services/api/productAccountService";

const ProductAccountPage = () => {
  const { productId } = useParams();

  const [form, setForm] = useState({
    accountData: "",
    usernameProductAccount: "",
    passwordProductAccount: "",
    dateChangePass: new Date().toISOString().slice(0, 16),
    sellCount: 0,
    sellDateFrom: new Date().toISOString().slice(0, 16),
    sellDateTo: new Date().toISOString().slice(0, 16),
    status: 0,
  });

  const [importText, setImportText] = useState("");
  const [importedAccounts, setImportedAccounts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImport = () => {
    const lines = importText.split("\n");
    const accounts = [];

    for (let line of lines) {
      const [username, password, sellCount] = line
        .split("|")
        .map((s) => s.trim());
      if (username && password && !isNaN(parseInt(sellCount))) {
        accounts.push({
          usernameProductAccount: username,
          passwordProductAccount: password,
          sellCount: parseInt(sellCount, 10),
        });
      }
    }

    setImportedAccounts(accounts);
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
      alert("Thêm tài khoản thành công");
    } catch (error) {
      console.error(error);
      alert("Thêm thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Thêm tài khoản sản phẩm</h2>
     <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">
          Import nhanh danh sách tài khoản
        </h3>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={6}
          className="w-full border rounded-md p-2 text-sm"
          placeholder="username|password|sellCount\nvd: user1|pass1|3"
        ></textarea>
        <button
          onClick={handleImport}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Import
        </button>

        {importedAccounts.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Danh sách tài khoản đã nhập:</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {importedAccounts.map((acc, index) => (
                <li key={index}>
                  <span className="font-mono">
                    {acc.usernameProductAccount} | {acc.passwordProductAccount}{" "}
                    | {acc.sellCount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ProductAccountForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <hr className="my-6" />

      
    </div>
  );
};

export default ProductAccountPage;
