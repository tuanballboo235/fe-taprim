import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CategorySection from "@/features/products/components/CategorySection";
import { useProducts } from "@/features/products/hooks/useProducts";
import PageState from "@/shared/components/PageState";
import notify from "@/shared/utils/notify";

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const { data, isLoading, isError } = useProducts(keyword);
  const sections = data?.data ?? [];

  useEffect(() => {
    if (isError) {
      notify.error("Không thể tải danh sách sản phẩm");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageState type="loading" description="Đang tải danh sách sản phẩm..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageState
          type="error"
          title="Không thể tải sản phẩm"
          description="Vui lòng thử lại sau ít phút."
        />
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {sections.length === 0 && !isLoading && !isError ? (
        <PageState
          type="empty"
          title="Không tìm thấy sản phẩm"
          description={`Không có sản phẩm nào phù hợp với từ khóa "${keyword}"`}
        />
      ) : (
        sections.map((section) => (
          <CategorySection
            key={section.title}
            title={section.title}
            description={section.description}
            products={section.products}
          />
        ))
      )}
    </div>
  );
};

export default ProductListPage;
