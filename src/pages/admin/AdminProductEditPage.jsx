import { useParams } from "react-router-dom";

const AdminProductEditPage = () => {
  const { productId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Chỉnh sửa sản phẩm</h1>
      <p className="text-sm text-gray-500">
        Màn hình chỉnh sửa sản phẩm #{productId} sẽ được nối với API cập nhật.
      </p>
    </div>
  );
};

export default AdminProductEditPage;
