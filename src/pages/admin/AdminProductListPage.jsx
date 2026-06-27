import { useMemo, useState } from "react";
import ProductTable from "@/features/adminProducts/components/ProductTable";
import ProductUpdateModal from "@/features/adminProducts/components/ProductUpdateModal";
import { getAdminProductDetail } from "@/features/adminProducts/api/adminProductApi";
import { useAdminProducts } from "@/features/adminProducts/hooks/useAdminProducts";
import { useUpdateProduct } from "@/features/adminProducts/hooks/useUpdateProduct";
import PageState from "@/shared/components/PageState";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const AdminProductListPage = () => {
  const { data, isLoading, isError, refetch } = useAdminProducts();
  const updateProduct = useUpdateProduct();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoadingEditDetail, setIsLoadingEditDetail] = useState(false);

  const sections = useMemo(() => data?.data ?? [], [data]);
  const productData = sections.filter((section) => section.categoryId === 1);
  const serviceData = sections.filter((section) => section.categoryId === 2);
  const categories = useMemo(
    () =>
      sections.map((section) => ({
        categoryId: section.categoryId,
        title: section.title ?? section.name ?? section.categoryName,
      })),
    [sections],
  );

  const handleOpenEdit = async (product) => {
    const productId = product?.productId ?? product?.id;
    if (!productId || isLoadingEditDetail) return;

    try {
      setIsLoadingEditDetail(true);
      const response = await getAdminProductDetail(productId);
      const detail = response?.data;

      if (!detail) {
        notify.error("Không thể tải chi tiết sản phẩm.");
        return;
      }

      setEditingProduct({
        ...product,
        productId,
        productName: detail.productName ?? product.name,
        productImage: detail.productImage ?? product.image,
        categoryId: detail.categoryId ?? product.categoryId,
        description: detail.description ?? "",
        status: detail.status ?? product.status,
      });
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Không thể tải chi tiết sản phẩm."),
      );
    } finally {
      setIsLoadingEditDetail(false);
    }
  };

  const handleCloseEdit = () => {
    if (updateProduct.isPending) return;
    setEditingProduct(null);
  };

  const handleSaveEdit = async (productDataForm) => {
    const productId = editingProduct?.productId ?? editingProduct?.id;
    if (!productId) return;

    try {
      const response = await updateProduct.mutateAsync({
        productId,
        productData: productDataForm,
      });

      if (response?.status && response.status !== "Success") {
        notify.error(response.message || "Cập nhật sản phẩm thất bại.");
        return;
      }

      notify.success("Cập nhật sản phẩm thành công.");
      setEditingProduct(null);
      await refetch();
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Cập nhật sản phẩm thất bại."));
    }
  };

  if (isLoading) {
    return <PageState type="loading" description="Đang tải sản phẩm..." />;
  }

  if (isError) {
    return (
      <PageState
        type="error"
        title="Không thể tải danh sách sản phẩm"
        description="Vui lòng thử lại sau ít phút."
      />
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Danh sách sản phẩm
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý sản phẩm và điều hướng tới khu tài khoản sản phẩm.
        </p>
        {isLoadingEditDetail && (
          <p className="mt-2 text-sm font-medium text-blue-600">
            Đang tải thông tin sản phẩm để chỉnh sửa...
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Sản phẩm</h2>
        <ProductTable data={productData} onEdit={handleOpenEdit} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Dịch vụ</h2>
        <ProductTable data={serviceData} onEdit={handleOpenEdit} />
      </div>

      <ProductUpdateModal
        isOpen={Boolean(editingProduct)}
        product={editingProduct}
        categories={categories}
        isSubmitting={updateProduct.isPending}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </section>
  );
};

export default AdminProductListPage;
