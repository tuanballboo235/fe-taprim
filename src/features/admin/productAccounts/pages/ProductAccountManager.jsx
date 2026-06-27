import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductSidebar from "@/features/admin/productAccounts/components/ProductSidebar";
import AccountTable from "@/features/admin/productAccounts/components/AccountTable";
import {
  addProductAccountToProduct,
  deleteProductAccounts,
  getProductAccountFilter,
  updateProductAccount,
} from "@/features/admin/productAccounts/api/productAccountService";
import { getProductDetail } from "@/features/products/api/productApi";
import PageState from "@/shared/components/PageState";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const ProductAccountManager = () => {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productAccounts, setProductAccounts] = useState([]);
  const [productInfo, setProductInfo] = useState("");
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchProductOptions = async () => {
      setIsBootLoading(true);

      try {
        const response = await getProductDetail(productId);
        const product = response?.data ?? response;
        const items = product?.productOptions ?? [];

        if (!isActive) return;

        setProducts(items);
        setProductInfo(product?.productName ?? "");
        setSelectedProduct(items[0] ?? null);
      } catch (error) {
        if (!isActive) return;

        setProducts([]);
        setSelectedProduct(null);
        notify.error(
          getApiErrorMessage(error, "Không thể tải danh sách gói sản phẩm.")
        );
      } finally {
        if (isActive) {
          setIsBootLoading(false);
        }
      }
    };

    fetchProductOptions();

    return () => {
      isActive = false;
    };
  }, [productId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchAccounts = useCallback(async () => {
    if (!selectedProduct?.productOptionId) {
      setProductAccounts([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await getProductAccountFilter({
        productOptionId: selectedProduct.productOptionId,
        username: debouncedSearchTerm || undefined,
      });
      const items = response?.data?.items ?? response?.items ?? [];
      setProductAccounts(items);
    } catch (error) {
      setProductAccounts([]);
      notify.error(getApiErrorMessage(error, "Không thể tải danh sách account."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct?.productOptionId, debouncedSearchTerm]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleEditAccount = async (accountPayload) => {
    const accountId = accountPayload?.productAccountId ?? accountPayload?.id;

    if (accountId) {
      try {
        await updateProductAccount(accountId, accountPayload);
        notify.success("Đã cập nhật account.");
        await fetchAccounts();
      } catch (error) {
        notify.error(getApiErrorMessage(error, "Không thể cập nhật account."));
        throw error;
      }

      return;
    }

    if (!selectedProduct?.productOptionId) {
      notify.warning("Vui lòng chọn gói sản phẩm trước khi thêm account.");
      return;
    }

    const payloads = Array.isArray(accountPayload)
      ? accountPayload
      : [accountPayload];

    if (payloads.length === 0) {
      notify.warning("Chưa có account nào để lưu.");
      return;
    }

    try {
      await addProductAccountToProduct(selectedProduct.productOptionId, payloads);

      notify.success(
        payloads.length > 1
          ? `Đã thêm ${payloads.length} account.`
          : "Đã thêm account."
      );
      await fetchAccounts();
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Không thể thêm account."));
      throw error;
    }
  };
  const handleDeleteAccount = async (accountId) => {
    if (!accountId) return;

    const confirmed = await notify.confirm({
      title: "Xóa account?",
      text: "Account sẽ bị vô hiệu hóa và không còn bán được. Đơn hàng cũ vẫn giữ lịch sử tra cứu.",
      confirmButtonText: "Xóa",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      const response = await deleteProductAccounts([accountId]);
      const deletedId = Number(accountId);
      setProductAccounts((current) =>
        current.filter(
          (account) => Number(account?.productAccountId ?? account?.id) !== deletedId
        )
      );
      notify.success(response?.message ?? "Đã xóa account.");
      await fetchAccounts();
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Không thể xóa account."));
    }
  };

  if (isBootLoading) {
    return <PageState type="loading" description="Đang tải thông tin sản phẩm..." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-md shadow-slate-200/70">
        <h1 className="text-xl font-semibold text-slate-900">
          Quản lý account sản phẩm
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {productInfo || "Chọn một gói sản phẩm để xem account đang có."}
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <ProductSidebar
          products={products}
          onSelect={setSelectedProduct}
          selectedProductId={selectedProduct?.productOptionId}
          productInfo={productInfo}
        />
        <AccountTable
          accounts={productAccounts}
          onEdit={handleEditAccount}
          isLoading={isLoading}
          onDelete={handleDeleteAccount}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default ProductAccountManager;
