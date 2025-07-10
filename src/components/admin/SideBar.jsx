import React, { useState } from 'react';
import {
  FaStore, FaBoxOpen, FaServicestack, FaCalendarAlt, FaBug,
  FaUsers, FaComment, FaTags, FaArrowUp, FaRegClock
} from 'react-icons/fa';
import { MdOutlineSell } from 'react-icons/md';

const menuSections = [
  {
    title: 'SALE',
    items: [
      { label: 'Sales', icon: <MdOutlineSell />, key: 'sales' }
    ]
  },
  {
    title: 'SHOP',
    items: [
      { label: 'Quản lý gian hàng', icon: <FaStore />, key: 'shop-manage' },
      { label: 'Đơn hàng sản phẩm', icon: <FaBoxOpen />, key: 'product-orders' },
      { label: 'Đơn hàng dịch vụ', icon: <FaServicestack />, key: 'service-orders' },
      { label: 'Đặt trước', icon: <FaRegClock />, key: 'booking' },
      { label: 'Khiếu nại', icon: <FaBug />, key: 'complaints' },
      { label: 'Quản lý Reseller', icon: <FaUsers />, key: 'resellers' },
      { label: 'Đánh giá', icon: <FaComment />, key: 'reviews' },
      { label: 'Mã giảm giá', icon: <FaTags />, key: 'discounts' },
      { label: 'Gian hàng Top 1', icon: <FaArrowUp />, key: 'top1' }
    ]
  }
];

const Sidebar = () => {
  const [activeKey, setActiveKey] = useState('shop-manage');

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#152133] to-[#1F2C42] text-white p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center font-bold text-xl mr-3">
          M
        </div>
        <span className="text-lg font-semibold">taphoammo.net</span>
      </div>

      {/* Menu Sections */}
      <div className="flex flex-col space-y-2">
        {menuSections.map(section => (
          <div key={section.title}>
            <p className="text-xs text-gray-400 font-semibold mt-4 mb-2">{section.title}</p>
            {section.items.map(item => {
              const isActive = activeKey === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`flex items-center px-3 py-2 rounded cursor-pointer text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#2F3E54] text-white'
                      : 'text-gray-400 hover:bg-[#2F3E54] hover:text-white'
                  }`}
                >
                  <span className={`text-base mr-3`}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
