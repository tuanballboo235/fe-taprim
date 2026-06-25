import { useState } from "react";
import Button from "@/shared/components/Button";
import notify from "@/shared/utils/notify";
import PaymentModal from "@/features/payments/components/PaymentModal";
import OrderAccount from "@/features/orders/components/OrderAccount";
import ContactCard from "@/features/contact/components/ContactCard";
import ProductDetailCard from "@/features/products/components/ProductDetailCard";
import ProductPrice from "@/features/products/components/ProductPrice";

const ModalFrame = ({ children, onClose, maxWidth = "max-w-2xl" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
    <div
      className={`relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-4 shadow-xl sm:p-6 ${maxWidth}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-500 transition hover:text-red-600"
        aria-label="Đóng"
      >
        x
      </button>
      {children}
    </div>
  </div>
);

function ProductCard({
  productId,
  productOptionId,
  image,
  title,
  price,
  salePrice,
  isSale = false,
  quantity = 0,
  customerEmail = "",
  onOrder,
}) {
  const hasDiscount = salePrice !== undefined && salePrice < price;
  const displayPrice = hasDiscount ? salePrice : price;
  const isOutOfStock = quantity <= 0;

  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const handlePaymentRequest = () => {
    if (isOutOfStock) {
      notify.warning("Sản phẩm đã hết hàng.");
      return;
    }

    if (!customerEmail) {
      notify.warning("Vui lòng vào trang chi tiết để nhập email mua hàng.");
      return;
    }

    setShowPayment(true);
  };

  const handleSuccess = (order) => {
    setOrderResult(order);
    setShowPayment(false);
    setShowProductDetails(false);
    setShowContact(false);
  };

  return (
    <>
      <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-green-500 hover:shadow-md">
        <div className="relative aspect-[4/3] bg-slate-50">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          {isSale && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
              SALE
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute right-3 top-3 rounded-full bg-slate-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
              Hết hàng{" "}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Số lượng:{" "}
              <span
                className={`font-semibold ${
                  isOutOfStock ? "text-red-600" : "text-slate-900"
                }`}
              >
                {quantity}
              </span>
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              {hasDiscount && (
                <ProductPrice
                  price={price}
                  className="text-xs text-slate-400 line-through"
                />
              )}
              <ProductPrice
                price={displayPrice}
                className="text-lg font-bold text-green-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowProductDetails(true)}
            >
              Chi tiết
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowContact(true);
                onOrder?.();
              }}
            >
              Liên hệ{" "}
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={isOutOfStock}
              onClick={handlePaymentRequest}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </article>

      {orderResult && (
        <ModalFrame onClose={() => setOrderResult(null)} maxWidth="max-w-lg">
          <OrderAccount order={orderResult} />
        </ModalFrame>
      )}

      {showPayment && (
        <ModalFrame onClose={() => setShowPayment(false)}>
          <PaymentModal
            onClose={() => setShowPayment(false)}
            onSuccess={handleSuccess}
            productOptionId={productOptionId ?? productId}
            productName={title}
            amount={displayPrice}
            fee={500}
            total={displayPrice + 500}
            customerEmail={customerEmail}
          />
        </ModalFrame>
      )}

      {showContact && (
        <ModalFrame onClose={() => setShowContact(false)} maxWidth="max-w-md">
          <ContactCard
            facebookUrl="https://www.facebook.com/taprim.vn"
            zaloUrl="https://zalo.me/taprim"
            phoneNumber="0934 567 890"
            fbGroupUrl="https://www.facebook.com/groups/taprim.vn"
          />
        </ModalFrame>
      )}

      {showProductDetails && (
        <ModalFrame
          onClose={() => setShowProductDetails(false)}
          maxWidth="max-w-4xl"
        >
          <ProductDetailCard
            title={title}
            description="Mô tả chi tiết sản phẩm sẽ được cập nhật sau."
            price={price}
            salePrice={salePrice}
            quantity={quantity}
            isSale={isSale}
          />
        </ModalFrame>
      )}
    </>
  );
}

export default ProductCard;
