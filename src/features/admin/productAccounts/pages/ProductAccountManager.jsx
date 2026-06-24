import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductSidebar from "@/features/admin/productAccounts/components/ProductSidebar";
import AccountTable from "@/features/admin/productAccounts/components/AccountTable";
import {
  addProductAccountToProduct,
  getProductAccountFilter,
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
          getApiErrorMessage(error, "Khong the tai danh sach goi san pham.")
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

  const fetchAccounts = useCallback(async () => {
    if (!selectedProduct?.productOptionId) {
      setProductAccounts([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await getProductAccountFilter({
        productOptionId: selectedProduct.productOptionId,
      });
      const items = response?.data?.items ?? response?.items ?? [];
      setProductAccounts(items);
    } catch (error) {
      setProductAccounts([]);
      notify.error(getApiErrorMessage(error, "Khong the tai danh sach account."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct?.productOptionId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleEditAccount = async (accountPayload) => {
    if (accountPayload?.id) {
      notify.info("Chua co API cap nhat account cho thao tac sua.");
      return;
    }

    if (!selectedProduct?.productOptionId) {
      notify.warning("Vui long chon goi san pham truoc khi them account.");
      return;
    }

    const payloads = Array.isArray(accountPayload)
      ? accountPayload
      : [accountPayload];

    if (payloads.length === 0) {
      notify.warning("Chua co account nao de luu.");
      return;
    }

    try {
      await Promise.all(
        payloads.map((payload) =>
          addProductAccountToProduct(selectedProduct.productOptionId, payload)
        )
      );

      notify.success(
        payloads.length > 1
          ? `Da them ${payloads.length} account.`
          : "Da them account."
      );
      await fetchAccounts();
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Khong the them account."));
      throw error;
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!accountId) return;

    const confirmed = await notify.confirm({
      title: "Xoa account khoi danh sach?",
      text: "Hien chua co API xoa account, thao tac nay chi cap nhat danh sach dang hien thi.",
      confirmButtonText: "Xoa",
      icon: "warning",
    });

    if (!confirmed) return;

    setProductAccounts((current) =>
      current.filter((account) => account.id !== accountId)
    );
    notify.success("Da xoa khoi danh sach hien thi.");
  };

  if (isBootLoading) {
    return <PageState type="loading" description="Dang tai thong tin san pham..." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Quan ly account san pham
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {productInfo || "Chon mot goi san pham de xem account dang co."}
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
        />
      </div>
    </div>
  );
};

export default ProductAccountManager;
