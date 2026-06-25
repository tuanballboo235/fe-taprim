import { useState } from "react";
import { useParams } from "react-router-dom";
import ProductAccountForm from "@/features/admin/productAccounts/components/ProductAccountForm";
import { addProductAccountToProduct } from "@/features/admin/productAccounts/api/productAccountService";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const getDefaultDateTime = () => new Date().toISOString().slice(0, 16);

const ProductAccountPage = () => {
  const { productId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    accountData: "",
    usernameProductAccount: "",
    passwordProductAccount: "",
    dateChangePass: getDefaultDateTime(),
    sellCount: 0,
    sellDateFrom: getDefaultDateTime(),
    sellDateTo: getDefaultDateTime(),
    status: 0,
  });

  const [importText, setImportText] = useState("");
  const [importedAccounts, setImportedAccounts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImport = () => {
    const accounts = importText
      .split("\n")
      .map((line) => line.split("|").map((value) => value.trim()))
      .filter(([username, password, sellCount]) => {
        return username && password && !Number.isNaN(parseInt(sellCount, 10));
      })
      .map(([username, password, sellCount]) => ({
        usernameProductAccount: username,
        passwordProductAccount: password,
        sellCount: parseInt(sellCount, 10),
      }));

    setImportedAccounts(accounts);

    if (accounts.length === 0) {
      notify.warning("Chưa có tài khoản hop le de import.");
    } else {
      notify.success(`Da doc ${accounts.length} tài khoản.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
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
      notify.success("Thêm tài khoản thành công.");
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Thêm tài khoản thất bại."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Thêm tài khoản sản phẩm
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nhap tay hoac import nhanh danh sách tài khoản theo dinh dang co san.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-base font-semibold text-slate-900">
          Import nhanh
        </h2>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={6}
          className="mt-3 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          placeholder="username|password|sellCount&#10;vd: user1|pass1|3"
        />

        <Button onClick={handleImport} variant="info" className="mt-3">
          Import
        </Button>

        {importedAccounts.length > 0 && (
          <div className="mt-4 rounded-md bg-white p-3">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Tài khoản da doc
            </h3>
            <ul className="max-h-48 space-y-1 overflow-auto pl-5 text-sm">
              {importedAccounts.map((acc, index) => (
                <li key={`${acc.usernameProductAccount}-${index}`} className="list-disc">
                  <span className="font-mono">
                    {acc.usernameProductAccount} | {acc.passwordProductAccount} |{" "}
                    {acc.sellCount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="my-6" />
      <ProductAccountForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </section>
  );
};

export default ProductAccountPage;
