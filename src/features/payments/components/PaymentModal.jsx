import { useEffect, useMemo, useRef, useState } from "react";
import {
  createQrPayment,
  getPaymentFilter,
} from "@/features/payments/api/paymentService";
import { updateOrder } from "@/features/orders/api/orderService";
import {
  getProductAccountByTransactionCode,
  getProductAccountFilter,
} from "@/features/admin/productAccounts/api/productAccountService";
import { getCouponInfoByCouponCode } from "@/features/coupons/api/couponService";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const DEFAULT_COUNTDOWN = 120;
const CHECK_INTERVAL = 10000;

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")}d`;

const PaymentModal = ({
  productOptionId,
  productName,
  amount,
  fee,
  total,
  onClose,
  onSuccess,
  customerEmail,
}) => {
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const countdownRef = useRef(null);
  const pollRef = useRef(null);
  const hasExpiredRef = useRef(false);

  const canPay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    (customerEmail || "").trim()
  );

  const discount = useMemo(() => {
    if (couponData?.isActive && couponData?.discountPercent > 0) {
      return Math.round(amount * (couponData.discountPercent / 100));
    }

    return 0;
  }, [amount, couponData]);

  const finalTotal = Math.max(0, total - discount);

  const clearTimers = () => {
    clearInterval(countdownRef.current);
    clearInterval(pollRef.current);
  };

  const handleApplyCoupon = async () => {
    const code = coupon.trim();
    if (!code || couponLoading) return;

    try {
      setCouponLoading(true);
      const res = await getCouponInfoByCouponCode(code);
      const data = res?.data;

      if (!data?.isActive || !data?.discountPercent) {
        setCouponData(null);
        notify.warning("Ma giam gia khong hop le hoac da het han.");
        return;
      }

      setCouponData(data);
      notify.success("Ap dung ma giam gia thanh cong.");
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Khong the ap dung ma giam gia."));
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    setCoupon("");
    setCouponData(null);
  };

  const handleProceedPayment = async () => {
    if (!canPay) {
      notify.error("Vui long nhap email hop le truoc khi thanh toan.");
      return;
    }

    try {
      setPaymentLoading(true);
      const check = await getProductAccountFilter({
        productOptionId,
        canSell: true,
      });

      if (check?.data?.items?.length === 0) {
        notify.warning(
          "San pham da het hang. Vui long lien he fanpage hoac Zalo de duoc tu van."
        );
        return;
      }

      const res = await createQrPayment(productOptionId, finalTotal);
      const { qrCode, transactionCode: trxCode } = res?.data || {};

      if (!qrCode || !trxCode) {
        notify.error("Khong nhan duoc ma QR tu he thong.");
        return;
      }

      setQrImage(qrCode);
      setTransactionCode(trxCode);
      setCountdown(DEFAULT_COUNTDOWN);
      setShowPaymentInfo(true);
      await updateOrder(trxCode, { contactInfo: customerEmail });
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Khong the tao ma QR thanh toan."));
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    setCouponData(null);
  }, [coupon]);

  useEffect(() => {
    clearTimers();

    if (!transactionCode || !showPaymentInfo) return undefined;

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimers();
          if (!hasExpiredRef.current) {
            notify.warning("Het thoi gian thanh toan.");
            hasExpiredRef.current = true;
            onClose?.();
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    pollRef.current = setInterval(async () => {
      try {
        const res = await getPaymentFilter(transactionCode);
        const data = Array.isArray(res?.data) ? res.data[0] : res.data;

        if (data?.status === 1) {
          clearTimers();
          const acc = await getProductAccountByTransactionCode(
            data.transactionCode
          );

          notify.success("Thanh toan thanh cong.");
          onClose?.();
          onSuccess?.({
            paymentTransactionCode: transactionCode,
            productName,
            productAccountData: acc?.data?.accountData,
            couponCode: couponData?.couponCode || null,
            contactInfo: customerEmail || "",
            totalAmount: finalTotal,
            paidAt: new Date().toISOString(),
            createAt: new Date().toISOString(),
            expiredAt: null,
          });
        }
      } catch (error) {
        clearTimers();
        notify.error(
          getApiErrorMessage(error, "Loi khi kiem tra trang thai thanh toan.")
        );
        onClose?.();
      }
    }, CHECK_INTERVAL);

    return clearTimers;
  }, [
    couponData,
    customerEmail,
    finalTotal,
    onClose,
    onSuccess,
    productName,
    showPaymentInfo,
    transactionCode,
  ]);

  return (
    <div className="mx-auto max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {productName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kiem tra thong tin va tao ma QR de thanh toan.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {customerEmail || "Chua co email"}
              </p>
              <p className="text-xs text-slate-500">
                Hoa don va thong tin don hang se gui ve email nay.
              </p>
            </div>
            <span
              className={[
                "w-fit rounded-full border px-2 py-1 text-xs font-medium",
                canPay
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700",
              ].join(" ")}
            >
              {canPay ? "Email hop le" : "Email khong hop le"}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="coupon"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Ma giam gia
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              placeholder="Nhap ma, vi du SAVE10"
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            {couponData ? (
              <Button variant="muted" onClick={clearCoupon}>
                Go ma
              </Button>
            ) : (
              <Button
                variant="info"
                onClick={handleApplyCoupon}
                disabled={!coupon.trim()}
                isLoading={couponLoading}
              >
                {couponLoading ? "Dang ap dung..." : "Ap dung"}
              </Button>
            )}
          </div>
          {discount > 0 && (
            <p className="mt-2 text-sm font-medium text-green-700">
              Da giam {formatCurrency(discount)}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          <div className="flex justify-between gap-4">
            <span>Gia san pham</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
          {discount > 0 && (
            <div className="flex justify-between gap-4 text-green-700">
              <span>Giam gia ({couponData?.discountPercent}%)</span>
              <strong>-{formatCurrency(discount)}</strong>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span>Phi giao dich</span>
            <strong>{formatCurrency(fee)}</strong>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base">
            <span className="font-semibold">Tong thanh toan</span>
            <strong className="text-green-700">{formatCurrency(finalTotal)}</strong>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleProceedPayment}
            disabled={!canPay || showPaymentInfo}
            isLoading={paymentLoading}
            className="w-full sm:w-auto"
          >
            {paymentLoading ? "Dang tao ma QR..." : "Tien hanh thanh toan"}
          </Button>
        </div>

        {showPaymentInfo && (
          <div className="grid gap-5 rounded-lg border border-green-200 bg-green-50 p-4 md:grid-cols-[220px_1fr]">
            <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-lg border border-white bg-white">
              <img src={qrImage} alt="QR code" className="w-full object-contain" />
            </div>

            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                Huong dan thanh toan
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Mo ung dung Mobile Banking.</li>
                <li>Chon thanh toan va quet ma QR.</li>
                <li>Cho 10-20 giay de he thong xac nhan.</li>
              </ol>
              <p className="mt-3 text-red-600">
                Ma QR het han sau{" "}
                <strong>{countdown}s</strong>. Neu da thanh toan nhung chua
                nhan don, vui long lien he Zalo 0344665098.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
