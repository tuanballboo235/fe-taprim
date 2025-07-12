import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Thêm
import {
  FaStore, FaBoxOpen, FaServicestack, FaCalendarAlt, FaBug,
  FaUsers, FaComment, FaTags, FaArrowUp, FaRegClock, FaBars
} from 'react-icons/fa';
import { MdOutlineSell } from 'react-icons/md';

const menuSections = [
  {
    title: 'SALE',
    items: [
      { label: 'Sales', icon: <MdOutlineSell />, key: 'sales', path: '/admin/sales' }
    ]
  },
  {
    title: 'SHOP',
    items: [
      { label: 'Quản lý gian hàng', icon: <FaStore />, key: 'admin-product-list', path: '/admin-product-list' },
      { label: 'Đơn hàng sản phẩm', icon: <FaBoxOpen />, key: 'product-orders', path: '/product' },
      { label: 'Đơn hàng dịch vụ', icon: <FaServicestack />, key: 'service-orders', path: '/admin/service-orders' },
      { label: 'Đặt trước', icon: <FaRegClock />, key: 'booking', path: '/admin/booking' },
      { label: 'Khiếu nại', icon: <FaBug />, key: 'complaints', path: '/admin/complaints' },
      { label: 'Quản lý Reseller', icon: <FaUsers />, key: 'resellers', path: '/admin/resellers' },
      { label: 'Đánh giá', icon: <FaComment />, key: 'reviews', path: '/admin/reviews' },
      { label: 'Mã giảm giá', icon: <FaTags />, key: 'discounts', path: '/admin/discounts' },
      { label: 'Gian hàng Top 1', icon: <FaArrowUp />, key: 'top1', path: '/admin/top1' }
    ]
  }
];

const Sidebar = () => {
  const [activeKey, setActiveKey] = useState('admin-product-list');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // <-- sử dụng điều hướng

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 w-full bg-[#152133] text-white flex items-center justify-between">
        <div className="flex items-center font-bold text-lg">taprim.com</div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 min-h-screen bg-gradient-to-b from-[#152133] to-[#1F2C42] text-white p-4 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center font-bold text-2xl mr-3">
            M
          </div>
          <span className="text-xl font-semibold">taprim.com</span>
        </div>

        {/* Menu */}
        <div className="flex flex-col space-y-4">
          {menuSections.map(section => (
            <div key={section.title}>
              <p className="text-sm text-gray-400 font-semibold mt-4 mb-2">{section.title}</p>
              {section.items.map(item => {
                const isActive = activeKey === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      setActiveKey(item.key);
                      navigate(item.path); // <-- chuyển trang
                      setIsOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 rounded cursor-pointer text-base transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#2F3E54] text-white'
                        : 'text-gray-400 hover:bg-[#2F3E54] hover:text-white'
                    }`}
                  >
                    <span className="text-lg mr-4">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
