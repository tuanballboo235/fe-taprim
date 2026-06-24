import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { getOrderByTransactionCode } from "@/features/orders/api/orderService";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

export default function OrderLookup() {
  const [orderData, setOrderData] = useState(null);
  const [transactionInput, setTransactionInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const transactionCode = transactionInput.trim();

    if (!transactionCode) {
      notify.warning("Vui long nhap ma giao dich.");
      return;
    }

    try {
      setLoading(true);
      const data = await getOrderByTransactionCode(transactionCode);

      if (!data.data || !data.data.paymentTransactionCode) {
        notify.warning("Khong tim thay don hang voi ma giao dich nay.");
        setOrderData(null);
        return;
      }

      setOrderData(data);
      notify.success("Da tim thay don hang.");
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Co loi xay ra khi tra cuu don hang.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Tra cuu don hang
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Nhap ma giao dich de xem thong tin don hang va tai khoan da mua.
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Nhap ma giao dich, vi du TAPR123456"
              value={transactionInput}
              onChange={(e) => setTransactionInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            <Button
              onClick={handleSearch}
              isLoading={loading}
              leftIcon={<FaSearch />}
              className="sm:min-w-36"
            >
              {loading ? "Dang tra cuu..." : "Tra cuu"}
            </Button>
          </div>
        </div>

        {orderData && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <OrderDetails order={orderData.data} />
          </div>
        )}
      </div>
    </section>
  );
}
