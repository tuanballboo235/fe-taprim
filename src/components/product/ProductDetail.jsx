import React, { useState } from 'react';

const tabs = [
  { key: 'info', label: 'Thông tin sản phẩm' },
  { key: 'warranty', label: 'Chính sách bảo hành' },
  { key: 'guide', label: 'Hướng dẫn sử dụng' },
];

const ProductDetailCard = ({
  title,
  description,
  price,
  salePrice,
  quantity,
  isSale = false,
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const hasDiscount = salePrice !== undefined && salePrice < price;
  const isOutOfStock = quantity === 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">{description || 'Không có mô tả chi tiết.'}</p>
            <div className="text-lg space-y-1">
              <div>
                <span className="text-gray-500">Tình trạng: </span>
                <span className={isOutOfStock ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Số lượng còn: </span>
                <span className="font-semibold">{quantity}</span>
              </div>
              <div>
                <span className="text-gray-500">Giá: </span>
                {hasDiscount ? (
                  <>
                    <span className="line-through text-gray-400 text-sm mr-2">
                      {price.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-red-600 font-bold text-xl">
                      {salePrice.toLocaleString('vi-VN')}₫
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900 font-bold text-xl">
                    {price.toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      case 'warranty':
        return (
          <div className="text-gray-600 text-sm leading-relaxed space-y-2">
            <p>Sản phẩm được bảo hành 6 tháng kể từ ngày mua.</p>
            <p>Chúng tôi hỗ trợ đổi trả nếu lỗi do nhà sản xuất trong 7 ngày đầu.</p>
            <p>Vui lòng giữ hóa đơn để đảm bảo quyền lợi bảo hành.</p>
          </div>
        );
      case 'guide':
        return (
          <div className="text-gray-600 text-sm leading-relaxed space-y-2">
            <p>• Sử dụng sản phẩm theo hướng dẫn kèm theo bao bì.</p>
            <p>• Tránh tiếp xúc với nước và nhiệt độ cao.</p>
            <p>• Bảo quản nơi khô ráo, thoáng mát sau khi sử dụng.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-6">
     

      {/* Chi tiết và Tabs */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {isSale && (
            <span className="inline-block mt-1 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              ĐANG KHUYẾN MÃI
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 font-medium ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Nội dung tab */}
        <div className="pt-2">{renderTabContent()}</div>

        {/* Hành động */}
        <div className="flex gap-3 mt-auto">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            Mua ngay
          </button>
          <button className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium">
            Liên hệ shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;
