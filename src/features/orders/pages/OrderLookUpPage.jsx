import { useState } from "react";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import OrderDetails from "@/features/orders/components/OrderDetails";
import {
  getOrderByTransactionCode,
  requestOrderLookupCode,
} from "@/features/orders/api/orderService";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

export default function OrderLookup() {
  const [orderData, setOrderData] = useState(null);
  const [transactionInput, setTransactionInput] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizedTransactionCode = transactionInput.trim();

  const handleRequestCode = async () => {
    if (!normalizedTransactionCode) {
      notify.warning("Vui lòng nhập mã giao dịch.");
      return;
    }

    try {
      setSendingCode(true);
      setOrderData(null);
      const response = await requestOrderLookupCode(normalizedTransactionCode);
      setSentEmail(response?.data?.email ?? response?.data?.Email ?? "");
      notify.success(response?.message ?? "Đã gửi mã xác nhận về email.");
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Có lỗi xảy ra khi gửi mã xác nhận.")
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleSearch = async () => {
    if (!normalizedTransactionCode) {
      notify.warning("Vui lòng nhập mã giao dịch.");
      return;
    }

    if (!verificationCode.trim()) {
      notify.warning("Vui lòng nhập mã xác nhận đã gửi vào email.");
      return;
    }

    try {
      setLoading(true);
      const data = await getOrderByTransactionCode(
        normalizedTransactionCode,
        verificationCode.trim()
      );

      if (!data.data || !data.data.paymentTransactionCode) {
        notify.warning("Không tìm thấy đơn hàng với mã giao dịch này.");
        setOrderData(null);
        return;
      }

      setOrderData(data);
      notify.success("Đã tìm thấy đơn hàng.");
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Có lỗi xảy ra khi tra cứu đơn hàng.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionChange = (event) => {
    setTransactionInput(event.target.value);
    setVerificationCode("");
    setSentEmail("");
    setOrderData(null);
  };

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Tra cứu đơn hàng
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Nhập mã giao dịch, nhận mã xác nhận qua email rồi xem thông tin đơn
            hàng và tài khoản đã mua.
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Nhập mã giao dịch, ví dụ TAPR123456"
              value={transactionInput}
              onChange={handleTransactionChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !sentEmail) handleRequestCode();
              }}
              className="min-w-0 rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            <Button
              onClick={handleRequestCode}
              isLoading={sendingCode}
              leftIcon={<FaEnvelope />}
              className="lg:min-w-44"
            >
              {sendingCode ? "Đang gửi mã..." : "Gửi mã xác nhận"}
            </Button>
          </div>

          {sentEmail && (
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 lg:grid-cols-[1fr_auto]">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Nhập mã xác nhận 6 số"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Mã xác nhận đã được gửi tới {sentEmail}. Mã có hiệu lực trong
                  10 phút.
                </p>
              </div>
              <Button
                onClick={handleSearch}
                isLoading={loading}
                leftIcon={<FaSearch />}
                className="lg:min-w-36"
              >
                {loading ? "Đang tra cứu..." : "Tra cứu"}
              </Button>
            </div>
          )}
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
