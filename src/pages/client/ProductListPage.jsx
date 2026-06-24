import { useEffect } from "react";
import CategorySection from "@/features/products/components/CategorySection";
import { useProducts } from "@/features/products/hooks/useProducts";
import PageState from "@/shared/components/PageState";
import notify from "@/shared/utils/notify";

const ProductListPage = () => {
  const { data, isLoading, isError } = useProducts();
  const sections = data?.data ?? [];

  useEffect(() => {
    if (isError) {
      notify.error("Khong the tai danh sach san pham");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageState type="loading" description="Dang tai danh sach san pham..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageState
          type="error"
          title="Khong the tai san pham"
          description="Vui long thu lai sau it phut."
        />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageState
          type="empty"
          title="Chua co san pham"
          description="Danh sach san pham se duoc cap nhat som."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {sections.map((section) => (
        <CategorySection
          key={section.title}
          title={section.title}
          description={section.description}
          products={section.products}
        />
      ))}
    </div>
  );
};

export default ProductListPage;
