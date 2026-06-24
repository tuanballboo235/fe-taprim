import ProductTable from "@/features/adminProducts/components/ProductTable";
import { useAdminProducts } from "@/features/adminProducts/hooks/useAdminProducts";
import PageState from "@/shared/components/PageState";

const AdminProductListPage = () => {
  const { data, isLoading, isError } = useAdminProducts();
  const sections = data?.data ?? [];
  const productData = sections.filter((section) => section.categoryId === 1);
  const serviceData = sections.filter((section) => section.categoryId === 2);

  if (isLoading) {
    return <PageState type="loading" description="Dang tai san pham..." />;
  }

  if (isError) {
    return (
      <PageState
        type="error"
        title="Khong the tai danh sach san pham"
        description="Vui long thu lai sau it phut."
      />
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Danh sach san pham
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quan ly san pham va dieu huong toi khu tai khoan san pham.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">San pham</h2>
        <ProductTable data={productData} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Dich vu</h2>
        <ProductTable data={serviceData} />
      </div>
    </section>
  );
};

export default AdminProductListPage;
