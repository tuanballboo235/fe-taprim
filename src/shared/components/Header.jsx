import {
  FaAngleRight,
  FaBars,
  FaBoxOpen,
  FaEnvelopeOpen,
  FaKey,
  FaLeaf,
  FaMailBulk,
  FaSearch,
  FaShieldAlt,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import notify from "@/shared/utils/notify";

const categories = [
  {
    name: "Tài khoản",
    path: "/tai-khoan",
    icon: <FaUser />,
    children: [
      {
        name: "Netflix",
        path: "/tai-khoan/netflix",
        icon: <FaEnvelopeOpen />,
      },
      { name: "Canva", path: "/tai-khoan/canva", icon: <FaLeaf /> },
    ],
  },
  {
    name: "Phần mềm",
    path: "/phan-mem",
    icon: <FaTools />,
    children: [
      { name: "ChatGPT Plus", path: "/phan-mem/chatgpt", icon: <FaKey /> },
      { name: "Capcut Pro", path: "/phan-mem/capcut", icon: <FaKey /> },
    ],
  },
  {
    name: "Dịch vụ khác",
    path: "/dich-vu",
    icon: <FaBoxOpen />,
    children: [],
  },
  {
    name: "Tra cứu đơn",
    path: "/order-lookup",
    icon: <FaLeaf />,
    children: [],
  },
];

const staticNav = [
  { name: "Sản phẩm", path: "/product", icon: <FaBoxOpen /> },
  {
    name: "Mail Update Netflix",
    path: "/netflix-mail",
    icon: <FaEnvelopeOpen />,
  },
  {
    name: "Mail Login Netflix",
    path: "/netflix-code",
    icon: <FaSignInAlt />,
  },
  { name: "Mail Code ChatGPT", path: "/chatgpt-code", icon: <FaMailBulk /> },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const [searchTerm, setSearchTerm] = useState(initialKeyword);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/product`);
    }
    closeMobileMenu();
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    notify.success("Đã đăng xuất.");
    navigate("/login", { replace: true });
  };

  const authActions = isAuthenticated ? (
    <>
      {isAdmin && (
        <Link
          to="/admin"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={closeMobileMenu}
        >
          <FaShieldAlt />
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
      >
        <FaSignOutAlt />
        Đăng xuất
      </button>
    </>
  ) : (
    <Link
      to="/login"
      className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
      onClick={closeMobileMenu}
    >
      <FaSignInAlt />
      Đăng nhập
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 text-sm shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center" onClick={closeMobileMenu}>
          <img
            src="https://res.cloudinary.com/dzcb8xqjh/image/upload/v1750269205/logo_crop_xlfxai.png"
            alt="TAPRIM"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <form
            onSubmit={handleSearch}
            className="flex overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm"
          >
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-0 flex-1 px-4 py-2 text-slate-700 outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-green-700 px-4 text-white transition hover:bg-green-800"
              title="Tìm kiếm"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-semibold text-green-800 transition hover:bg-green-50"
          >
            <FaShoppingCart />
            Giỏ hàng
          </Link>
          {authActions}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-green-700 md:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          title={mobileOpen ? "Đóng menu" : "Mở menu"}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className="hidden border-t border-slate-100 px-4 md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 py-2 font-medium text-slate-700">
          {staticNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-green-50 hover:text-green-700"
            >
              {item.icon} {item.name}
            </Link>
          ))}

          {categories.map((cat) => (
            <div key={cat.name} className="group relative">
              <Link
                to={cat.path}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-green-50 hover:text-green-700"
              >
                {cat.icon} {cat.name}
              </Link>
              {cat.children.length > 0 && (
                <div className="invisible absolute left-0 top-full z-50 min-w-[190px] rounded-md border border-slate-200 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {cat.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition hover:bg-green-50 hover:text-green-700"
                    >
                      {child.icon} {child.name}
                      <FaAngleRight className="ml-auto text-xs" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {mobileOpen && (
        <nav className="space-y-4 border-t border-slate-100 bg-white px-4 py-4 shadow md:hidden">
          <form
            onSubmit={handleSearch}
            className="flex overflow-hidden rounded-md border border-slate-300"
          >
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-green-700 px-3 text-white"
              title="Tìm kiếm"
            >
              <FaSearch />
            </button>
          </form>

          <div className="grid gap-1">
            {staticNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-800 hover:bg-green-50 hover:text-green-700"
                onClick={closeMobileMenu}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </div>

          <div className="grid gap-1">
            {categories.map((cat) => (
              <div key={cat.name}>
                <Link
                  to={cat.path}
                  className="flex items-center gap-2 rounded-md px-3 py-2 font-semibold text-green-800 hover:bg-green-50"
                  onClick={closeMobileMenu}
                >
                  {cat.icon} {cat.name}
                </Link>
                {cat.children.length > 0 && (
                  <div className="ml-4 border-l border-slate-200 pl-2">
                    {cat.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700"
                        onClick={closeMobileMenu}
                      >
                        <FaAngleRight className="text-xs" /> {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-2 border-t border-slate-100 pt-4">
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-md px-3 py-2 font-semibold text-green-800 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <FaShoppingCart />
              Giỏ hàng
            </Link>
            {authActions}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
