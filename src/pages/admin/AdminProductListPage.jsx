import ProductTable from "@/features/adminProducts/components/ProductTable";
import { useAdminProducts } from "@/features/adminProducts/hooks/useAdminProducts";
import PageState from "@/shared/components/PageState";

const AdminProductListPage = () => {
  const { data, isLoading, isError } = useAdminProducts();
  const sections = data?.data ?? [];
  const productData = sections.filter((section) => section.categoryId === 1);
  const serviceData = sections.filter((section) => section.categoryId === 2);

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
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Sản phẩm</h2>
        <ProductTable data={productData} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Dịch vụ</h2>
        <ProductTable data={serviceData} />
      </div>
    </section>
  );
};

export default AdminProductListPage;
