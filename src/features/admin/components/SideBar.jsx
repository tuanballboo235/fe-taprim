import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import { useAuth } from "@/features/auth/hooks/useAuth";
import notify from "@/shared/utils/notify";

const menuSections = [
  {
    title: "SALE",
    items: [
      { label: "Sales", icon: <MdOutlineSell />, key: "sales", path: "/admin/sales" },
    ],
  },
  {
    title: "SHOP",
    items: [
      {
        label: "Quản lý gian hàng",
        icon: <FaStore />,
        key: "admin-product-list",
        path: "/admin-product-list",
      },
      {
        label: "Đơn hàng sản phẩm",
        icon: <FaBoxOpen />,
        key: "product-orders",
        path: "/product",
      },
      {
        label: "Đơn hàng dịch vụ",
        icon: <FaServicestack />,
        key: "service-orders",
        path: "/admin/service-orders",
      },
      {
        label: "Đặt trước",
        icon: <FaRegClock />,
        key: "booking",
        path: "/admin/booking",
      },
      {
        label: "Khiếu nại",
        icon: <FaBug />,
        key: "complaints",
        path: "/admin/complaints",
      },
      {
        label: "Quản lý reseller",
        icon: <FaUsers />,
        key: "resellers",
        path: "/admin/resellers",
      },
      {
        label: "Đánh giá",
        icon: <FaComment />,
        key: "reviews",
        path: "/admin/reviews",
      },
      {
        label: "Mã giảm giá",
        icon: <FaTags />,
        key: "discounts",
        path: "/admin/discounts",
      },
      {
        label: "Gian hàng Top 1",
        icon: <FaArrowUp />,
        key: "top1",
        path: "/admin/top1",
      },
    ],
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const handleNavigate = (item) => {
    navigate(item.path);
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    notify.success("Đã đăng xuất.");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="flex w-full items-center justify-between bg-slate-950 px-4 py-3 text-white md:hidden">
        <div className="font-semibold">TAPRIM Admin</div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-xl"
          title={isOpen ? "Đóng menu" : "Mở menu"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-4 text-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-0 md:translate-x-0 md:shadow-none`}
      >
        <div className="mb-6 flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-xl font-bold">
            T
          </div>
          <div>
            <p className="text-lg font-semibold">TAPRIM</p>
            <p className="text-xs text-slate-400">Admin panel</p>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => handleNavigate(item)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${
                        isActive
                          ? "bg-green-600 text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          {user?.username && (
            <p className="mb-3 truncate px-3 text-sm text-slate-300">
              {user.username}
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <FaSignOutAlt className="text-base" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
