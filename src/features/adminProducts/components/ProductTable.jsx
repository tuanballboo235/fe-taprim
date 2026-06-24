import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import ProductPrice from "@/features/products/components/ProductPrice";
import Button from "@/shared/components/Button";

const ProductTable = ({ data = [] }) => {
  const navigate = useNavigate();
  const rows = data.flatMap((category) =>
    (category.products ?? []).map((product) => ({
      ...product,
      categoryName: category.name ?? category.categoryName ?? "",
    }))
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">San pham</th>
            <th className="px-4 py-3 font-semibold">Danh muc</th>
            <th className="px-4 py-3 font-semibold">Don gia</th>
            <th className="px-4 py-3 font-semibold">Kho</th>
            <th className="px-4 py-3 font-semibold">Trang thai</th>
            <th className="px-4 py-3 text-right font-semibold">Thao tac</th>
          </tr>
        </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length > 0 ? (
              rows.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {item.categoryName || "Chua phan loai"}
                  </td>
                  <td className="px-4 py-3">
                    <ProductPrice
                      minPrice={item.minPrice}
                      maxPrice={item.maxPrice}
                      fallback="Khong co gia"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.stockAccount > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.stockAccount > 0 ? item.stockAccount : "Het hang"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === 1
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status === 1 ? "Hoat dong" : "An"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<FaEdit />}
                        className="px-3"
                      title="Chinh sua"
                      onClick={() => navigate(`/admin-products/${item.id}/edit`)}
                    >
                        Sua
                      </Button>
                      <Button
                        size="sm"
                        variant="info"
                        leftIcon={<FaPlus />}
                        className="px-3"
                      title="Them tai khoan"
                      onClick={() => navigate(`/admin-product-account/${item.id}`)}
                    >
                        Account
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-slate-500">
                Khong co du lieu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ProductTable;
