import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Minus,
  PackageCheck,
  PackageX,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { FANPAGE_URL } from "@/shared/constants/Contact";
import { getAssetUrl } from "@/shared/utils/apiEndpoint";
import notify from "@/shared/utils/notify";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";
import ContactPurchaseButton from "@/features/contact/components/ContactPurchaseButton";
import OrderDetails from "@/features/orders/components/OrderDetails";
import PaymentModal from "@/features/payments/components/PaymentModal";
import { clearOrderAndPaymentTempByTransactionCode } from "@/features/payments/api/paymentService";
import { decreaseCouponUsage } from "@/features/coupons/api/couponService";
import ProductPrice from "@/features/products/components/ProductPrice";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";

const fallbackImage =
  "https://res.cloudinary.com/dzcb8xqjh/image/upload/v1750269205/logo_crop_xlfxai.png";

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: productResponse,
    isLoading,
    isError,
    refetch: refetchProductDetail,
  } = useProductDetail(id);

  const product = productResponse?.data;
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [currentPaymentTransactionCode, setCurrentPaymentTransactionCode] =
    useState("");
  const [orderResult, setOrderResult] = useState(null);

  const options = useMemo(() => product?.productOptions ?? [], [product]);
  const selectedOption = useMemo(() => {
    return (
      options.find((option) => option.productOptionId === selectedOptionId) ??
      options.find((option) => (option.sellCount ?? 0) > 0) ??
      options[0] ??
      null
    );
  }, [options, selectedOptionId]);

  const hasAnySellLeft = options.some((option) => (option.sellCount ?? 0) > 0);
  const selectedSellCount = selectedOption?.sellCount ?? 0;
  const selectedPrice = selectedOption?.price ?? 0;
  const transactionFee = 500;
  const subtotal = selectedPrice * quantity;
  const selectedImage =
    selectedOption?.productOptionImage ?? product?.productImage;
  const descriptionText = product?.description?.trim();

  useEffect(() => {
    if (isError) {
      notify.error("Không thể tải thông tin sản phẩm.");
      navigate("/product", { replace: true });
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!product || selectedOptionId) return;

    const available =
      product.productOptions?.find((option) => (option.sellCount ?? 0) > 0) ??
      product.productOptions?.[0];

    if (available) {
      setSelectedOptionId(available.productOptionId);
    }
  }, [product, selectedOptionId]);

  useEffect(() => {
    setQuantity((currentQuantity) => {
      if (selectedSellCount <= 0) return 1;
      return Math.min(Math.max(currentQuantity, 1), selectedSellCount);
    });
  }, [selectedOptionId, selectedSellCount]);

  useEffect(() => {
    if (!product) return;

    if (product.status === 0 || product.canSell === false) {
      notify.error("Sản phẩm này hiện không khả dụng.");
      navigate("/product", { replace: true });
    }
  }, [product, navigate]);

  const updateQuantity = (nextQuantity) => {
    if (selectedSellCount <= 0) {
      setQuantity(1);
      return;
    }

    const parsedQuantity = Number.parseInt(nextQuantity, 10);
    const safeQuantity = Number.isNaN(parsedQuantity) ? 1 : parsedQuantity;
    setQuantity(Math.min(Math.max(safeQuantity, 1), selectedSellCount));
  };

  const handleClosePayment = async (
    transactionCode = currentPaymentTransactionCode,
    shouldClearTempOrder = true,
  ) => {
    if (shouldClearTempOrder && transactionCode) {
      try {
        await clearOrderAndPaymentTempByTransactionCode(transactionCode);
      } catch {
        notify.warning("Không thể dọn đơn hàng tạm.");
      }
    }

    setCurrentPaymentTransactionCode("");
    setShowPayment(false);
    refetchProductDetail();
  };

  const handlePaymentSuccess = async (order) => {
    setOrderResult(order);
    setCurrentPaymentTransactionCode("");
    setShowPayment(false);
    refetchProductDetail();

    if (order.couponCode) {
      try {
        await decreaseCouponUsage(order.couponCode);
      } catch {
        notify.warning(
          "Thanh toán thành công nhưng chưa cập nhật lượt coupon.",
        );
      }
    }
  };

  const handleBuyNow = () => {
    if (selectedSellCount <= 0) {
      notify.warning(
        "Sản phẩm đã hết hàng. Vui lòng chọn gói khác hoặc liên hệ hỗ trợ.",
      );
      return;
    }

    if (quantity < 1) {
      notify.warning("Số lượng mua tối thiểu là 1 tài khoản.");
      return;
    }

    if (quantity > selectedSellCount) {
      notify.warning(`Chỉ còn ${selectedSellCount} tài khoản khả dụng.`);
      updateQuantity(selectedSellCount);
      return;
    }

    if (!email.trim()) {
      notify.warning("Vui lòng nhập email trước khi mua hàng.");
      return;
    }

    if (!validateEmail(email.trim())) {
      notify.error("Email không hợp lệ, vui lòng kiểm tra lại.");
      return;
    }

    setShowPayment(true);
  };

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <PageState
          type="loading"
          description="Đang tải thông tin sản phẩm..."
        />
      </div>
    );
  }

  return (
    <section className="bg-slate-50 px-4 py-6 sm:py-8">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,430px)_1fr] lg:items-start">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 p-3">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-white">
              <img
                src={getAssetUrl(selectedImage)}
                alt={product.productName}
                className="h-full w-full object-contain p-4"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <BookOpenText className="h-4 w-4 text-green-700" />
              Mô tả sản phẩm
            </div>
            <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {descriptionText || "Chưa có mô tả sản phẩm."}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Sản phẩm
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  hasAnySellLeft
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {hasAnySellLeft ? (
                  <PackageCheck className="h-3.5 w-3.5" />
                ) : (
                  <PackageX className="h-3.5 w-3.5" />
                )}
                {hasAnySellLeft ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>

            <h1 className="text-2xl font-semibold leading-snug text-slate-950 sm:text-3xl">
              {product.productName}
            </h1>

            <div className="mt-5 flex flex-col gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Giá đang chọn
                </p>
                <div className="mt-1 text-3xl font-bold text-green-700">
                  <ProductPrice price={selectedPrice} />
                </div>
              </div>

              <div className="grid gap-2 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <span>Thể loại:</span>
                  <strong className="text-slate-900">
                    {product.categoryName || "-"}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-2">
                  <PackageCheck
                    className={`h-4 w-4 ${
                      selectedSellCount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  />
                  <span>Kho :</span>
                  <strong
                    className={
                      selectedSellCount > 0 ? "text-green-700" : "text-red-600"
                    }
                  >
                    {selectedSellCount > 0 ? selectedSellCount : "Hết hàng"}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Clock3 className="h-4 w-4 text-green-700" />
                Chọn thời hạn
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {options.map((option) => {
                  const isDisabled = (option.sellCount ?? 0) === 0;
                  const isSelected =
                    selectedOptionId === option.productOptionId;

                  return (
                    <button
                      key={option.productOptionId}
                      type="button"
                      onClick={() =>
                        setSelectedOptionId(option.productOptionId)
                      }
                      className={[
                        "flex min-h-[82px] items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition",
                        isSelected
                          ? "border-green-700 bg-green-50 text-green-900 shadow-sm"
                          : "border-slate-300 bg-white text-slate-700 hover:border-green-500 hover:bg-green-50/40",
                        isDisabled ? "opacity-65" : "",
                      ].join(" ")}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {option.label}
                        </span>
                        <span className="mt-1 block font-bold text-green-700">
                          <ProductPrice price={option.price ?? 0} />
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-green-700 shadow-sm">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Đang chọn
                          </span>
                        ) : isDisabled ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Hết hàng
                          </span>
                        ) : (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Số lượng tài khoản
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Tối thiểu 1, tối đa theo số lượng còn trong kho.
                  </p>
                </div>

                <div className="flex w-full items-center rounded-md border border-slate-300 bg-white sm:w-[170px]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={selectedSellCount <= 0 || quantity <= 1}
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(selectedSellCount, 1)}
                    value={quantity}
                    onChange={(event) => updateQuantity(event.target.value)}
                    disabled={selectedSellCount <= 0}
                    className="h-10 min-w-0 flex-1 border-x border-slate-200 bg-white text-center text-sm font-semibold text-slate-900 outline-none disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={
                      selectedSellCount <= 0 || quantity >= selectedSellCount
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-600">Tạm tính</span>
                <strong className="text-lg text-green-700">
                  <ProductPrice price={subtotal} />
                </strong>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="h-4 w-4 text-green-700" />
                Email nhận thông tin đơn hàng
                <span className="text-red-600">*</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Nhập email khách hàng..."
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
              <span className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                Thông tin đơn hàng và bảo hành sẽ được gửi về email này.
              </span>
            </label>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
              <Button
                onClick={handleBuyNow}
                className="flex-1"
                leftIcon={<ShoppingCart className="h-4 w-4" />}
              >
                Mua ngay
              </Button>
              <ContactPurchaseButton
                className="flex-1"
                label="Liên hệ mua hàng"
                items={[
                  { text: "Chat Zalo", href: "https://zalo.me/0344665098" },
                  { text: "Fanpage Facebook", href: FANPAGE_URL },
                ]}
              />
            </div>

            <div className="grid gap-3 border-t border-slate-100 pt-5 text-sm text-slate-600 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                <span>Nhận account ngay sau khi thanh toán thành công.</span>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                <span>Shop hỗ trợ qua Zalo/Fanpage nếu cần kiểm tra đơn.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() =>
                handleClosePayment(currentPaymentTransactionCode, true)
              }
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xl font-bold text-slate-500 shadow hover:text-red-600"
            >
              x
            </button>
            <PaymentModal
              productOptionId={selectedOptionId}
              productName={product.productName}
              amount={selectedPrice}
              quantity={quantity}
              stockQuantity={selectedSellCount}
              fee={transactionFee}
              customerEmail={email}
              onClose={handleClosePayment}
              onSuccess={handlePaymentSuccess}
              onTransactionChange={setCurrentPaymentTransactionCode}
            />
          </div>
        </div>
      )}

      {orderResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 shadow-xl sm:p-6">
            <button
              type="button"
              onClick={() => setOrderResult(null)}
              className="absolute right-3 top-3 rounded-full bg-slate-100 px-3 py-1 text-xl font-bold text-slate-500 hover:text-red-600"
            >
              x
            </button>
            <OrderDetails order={orderResult} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetailPage;
