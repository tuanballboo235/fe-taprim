import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CubeIcon, TagIcon } from "@heroicons/react/24/solid";
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
  } = useProductDetail(id);

  const product = productResponse?.data;
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [email, setEmail] = useState("");
  const [showPayment, setShowPayment] = useState(false);
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
  const selectedImage = selectedOption?.productOptionImage ?? product?.productImage;

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
    if (!product) return;

    if (product.status === 0 || product.canSell === false) {
      notify.error("Sản phẩm này hiện không khả dụng.");
      navigate("/product", { replace: true });
    }
  }, [product, navigate]);

  const handleClosePayment = async (transactionCode) => {
    if (transactionCode) {
      try {
        await clearOrderAndPaymentTempByTransactionCode(transactionCode);
      } catch {
        notify.warning("Không thể dọn đơn hàng tạm.");
      }
    }

    setShowPayment(false);
  };

  const handlePaymentSuccess = async (order) => {
    setOrderResult(order);
    setShowPayment(false);

    if (order.couponCode) {
      try {
        await decreaseCouponUsage(order.couponCode);
      } catch {
        notify.warning("Thanh toán thành công nhưng chưa cập nhật lượt coupon.");
      }
    }
  };

  const handleBuyNow = () => {
    if (selectedSellCount <= 0) {
      notify.warning(
        "Sản phẩm đã hết hàng. Vui lòng chọn gói khác hoặc liên hệ hỗ trợ."
      );
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
        <PageState type="loading" description="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <img
              src={getAssetUrl(selectedImage)}
              alt={product.productName}
              className="h-72 w-full object-contain p-3"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Sản phẩm
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-snug text-slate-900">
              {product.productName}
            </h1>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2 text-slate-700">
              <CubeIcon
                className={`h-4 w-4 ${
                  hasAnySellLeft ? "text-green-600" : "text-red-500"
                }`}
              />
              <span>Kho:</span>
              <strong
                className={hasAnySellLeft ? "text-green-700" : "text-red-600"}
              >
                {selectedSellCount > 0 ? selectedSellCount : "Hết hàng"}
              </strong>
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <TagIcon className="h-4 w-4 text-slate-500" />
              <span>Thể loại:</span>
              <strong>{product.categoryName}</strong>
            </p>
          </div>

          <div className="text-2xl font-bold text-green-700">
            <ProductPrice price={selectedPrice} />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Chọn thời hạn
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const optionSellLeft = option.sellCount ?? 0;
                const isDisabled = optionSellLeft === 0;
                const isSelected = selectedOptionId === option.productOptionId;

                return (
                  <button
                    key={option.productOptionId}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedOptionId(option.productOptionId)}
                    className={[
                      "rounded-md border px-4 py-3 text-left text-sm transition",
                      isSelected
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "border-slate-300 bg-white text-slate-700 hover:border-green-500",
                      isDisabled ? "cursor-not-allowed opacity-50" : "",
                    ].join(" ")}
                  >
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-1 block">
                      <ProductPrice price={option.price ?? 0} />
                      {isDisabled && (
                        <span className="ml-2 text-xs text-red-600">
                          Hết hàng
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">
              Email khách hàng <span className="text-red-600">*</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Nhập email khách hàng..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Thông tin đơn hàng và bảo hành sẽ được gửi về email này.
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleBuyNow} className="flex-1">
              Mua ngay
            </Button>
            <ContactPurchaseButton
              label="Liên hệ mua hàng"
              items={[
                { text: "Chat Zalo", href: "https://zalo.me/0344665098" },
                { text: "Fanpage Facebook", href: FANPAGE_URL },
              ]}
            />
          </div>
        </div>

        {product.description && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-slate-800 lg:col-span-2">
            <p className="mb-2 font-semibold text-orange-700">Lưu ý</p>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {product.description}
            </pre>
          </div>
        )}
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() => handleClosePayment()}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xl font-bold text-slate-500 shadow hover:text-red-600"
            >
              x
            </button>
            <PaymentModal
              productOptionId={selectedOptionId}
              productName={product.productName}
              amount={selectedPrice}
              fee={500}
              customerEmail={email}
              total={selectedPrice + 500}
              onClose={handleClosePayment}
              onSuccess={handlePaymentSuccess}
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
