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
          getApiErrorMessage(error, "Không thể tai danh sách goi sản phẩm.")
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
      notify.error(getApiErrorMessage(error, "Không thể tai danh sách account."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct?.productOptionId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleEditAccount = async (accountPayload) => {
    if (accountPayload?.id) {
      notify.info("Chưa có API cập nhật account cho thao tác sửa.");
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
      await Promise.all(
        payloads.map((payload) =>
          addProductAccountToProduct(selectedProduct.productOptionId, payload)
        )
      );

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
      title: "Xóa account khỏi danh sách?",
      text: "Hiện chưa có API xóa account, thao tác này chỉ cập nhật danh sách đang hiển thị.",
      confirmButtonText: "Xóa",
      icon: "warning",
    });

    if (!confirmed) return;

    setProductAccounts((current) =>
      current.filter((account) => account.id !== accountId)
    );
    notify.success("Đã xóa khỏi danh sách hiển thị.");
  };

  if (isBootLoading) {
    return <PageState type="loading" description="Đang tải thong tin sản phẩm..." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Quan ly account sản phẩm
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {productInfo || "Chon mot goi sản phẩm de xem account dang co."}
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
