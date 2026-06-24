import { useParams } from "react-router-dom";

const AdminProductEditPage = () => {
  const { productId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Chinh sua san pham</h1>
      <p className="text-sm text-gray-500">
        Man hinh chinh sua san pham #{productId} se duoc noi voi API update.
      </p>
    </div>
  );
};

export default AdminProductEditPage;
