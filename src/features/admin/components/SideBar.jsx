import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowUp,
  FaBars,
  FaBoxOpen,
  FaBug,
  FaComment,
  FaRegClock,
  FaServicestack,
  FaSignOutAlt,
  FaStore,
  FaTags,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import { useAuth } from "@/features/auth/hooks/useAuth";

const menuSections = [
  {
    title: "SALE",
    items: [{ label: "Sales", icon: <MdOutlineSell />, key: "sales", path: "/admin/sales" }],
  },
  {
    title: "SHOP",
    items: [
      { label: "Quản lý gian hàng", icon: <FaStore />, key: "admin-product-list", path: "/admin-product-list" },
      { label: "Đơn hàng sản phẩm", icon: <FaBoxOpen />, key: "product-orders", path: "/product" },
      { label: "Đơn hàng dịch vụ", icon: <FaServicestack />, key: "service-orders", path: "/admin/service-orders" },
      { label: "Đặt trước", icon: <FaRegClock />, key: "booking", path: "/admin/booking" },
      { label: "Khiếu nại", icon: <FaBug />, key: "complaints", path: "/admin/complaints" },
      { label: "Quản lý Reseller", icon: <FaUsers />, key: "resellers", path: "/admin/resellers" },
      { label: "Đánh giá", icon: <FaComment />, key: "reviews", path: "/admin/reviews" },
      { label: "Mã giảm giá", icon: <FaTags />, key: "discounts", path: "/admin/discounts" },
      { label: "Gian hàng Top 1", icon: <FaArrowUp />, key: "top1", path: "/admin/top1" },
    ],
  },
];

const Sidebar = () => {
  const [activeKey, setActiveKey] = useState("admin-product-list");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleNavigate = (item) => {
    setActiveKey(item.key);
    navigate(item.path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="md:hidden p-4 w-full bg-[#152133] text-white flex items-center justify-between">
        <div className="flex items-center font-bold text-lg">taprim.com</div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="text-2xl"
          title="Mở menu"
        >
          <FaBars />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex min-h-screen w-64 flex-col bg-gradient-to-b from-[#152133] to-[#1F2C42] p-4 text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center font-bold text-2xl mr-3">
            M
          </div>
          <span className="text-xl font-semibold">taprim.com</span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="text-sm text-gray-400 font-semibold mt-4 mb-2">
                {section.title}
              </p>
              {section.items.map((item) => {
                const isActive = activeKey === item.key;

                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => handleNavigate(item)}
                    className={`flex w-full items-center px-4 py-3 rounded text-left text-base transition-colors duration-150 ${
                      isActive
                        ? "bg-[#2F3E54] text-white"
                        : "text-gray-400 hover:bg-[#2F3E54] hover:text-white"
                    }`}
                  >
                    <span className="text-lg mr-4">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          {user?.username && (
            <p className="mb-3 truncate text-sm text-gray-300">{user.username}</p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 rounded text-left text-base text-gray-300 transition-colors duration-150 hover:bg-[#2F3E54] hover:text-white"
          >
            <FaSignOutAlt className="text-lg mr-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
