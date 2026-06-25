import { useState } from "react";
import Button from "@/shared/components/Button";
import notify from "@/shared/utils/notify";

export default function OrderAccount({ order }) {
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.productAccountData || "");
      setCopied(true);
      notify.success("Da copy account.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error("Không thể copy account.");
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          Thành công
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">
          Thanh toán thành công
        </h2>
      </div>

      <div className="mt-5 space-y-4 text-sm">
        <div>
          <p className="font-semibold text-slate-600">Ma giao dịch</p>
          <p className="mt-1 break-words text-slate-900">
            {order.paymentTransactionCode || "-"}
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-600">Ten sản phẩm</p>
          <p className="mt-1 text-slate-900">{order.productName || "-"}</p>
        </div>

        <div>
          <p className="font-semibold text-slate-600">Account sản phẩm</p>
          {showAccount ? (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
              <span className="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 break-all">
                {order.productAccountData || "-"}
              </span>
              <Button size="sm" variant="info" onClick={handleCopy}>
                {copied ? "Da copy" : "Copy"}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={() => setShowAccount(true)}
            >
              Hien account
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
