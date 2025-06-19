import React from "react";
import OrderDetails from "../../components/order/OrderDetails";
const mockOrderData = {
  orderId: 3,
  couponId: 1,
  couponCode: "test",
  couponDiscountPersent: 43,
  productId: 2,
  productName: "Netflix1 tháng",
  productAccountId: 3,
  productAccountData: "tuanballboo6@gmail.com:netflix22442",
  status: 1,
  createAt: "2025-06-16T19:01:22.973",
  remainGetCode: 0,
  expiredAt: "2025-06-17T18:24:08.327",
  contactInfo: "string",
  paymentTransactionCode: "TAPR NBDZ",
  paidAt: "2025-06-17T02:02:05",
  totalAmount: 0,
  clientNote: "string"
};

export default function OrderLookup() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <OrderDetails order={mockOrderData} />
    </div>
  );
}
