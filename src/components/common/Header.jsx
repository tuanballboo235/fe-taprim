import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaAngleRight,
  FaBoxOpen,
  FaEnvelopeOpen,
  FaSignInAlt,
  FaMailBulk,
  FaKey,
  FaUser,
  FaTools,
  FaLeaf,
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
    { name: "Sản Phẩm", path: "/product", icon: <FaBoxOpen /> },
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

  return (
    <header className="w-full bg-white shadow-md text-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-green-800"
        >
          <img src="https://res.cloudinary.com/dzcb8xqjh/image/upload/v1750269205/logo_crop_xlfxai.png" alt="logo" className="w-32 h-15 object-contain" />
          
        </Link>

        {/* Search bar */}
        <div className="flex-1 mx-4 hidden md:flex">
          <div className="flex w-full border rounded overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="flex-1 px-4 py-2 outline-none text-gray-700"
            />
            <button className="bg-green-700 text-white px-4 flex items-center justify-center">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <Link
            to="/cart"
            className="text-green-800 font-medium flex items-center hover:scale-105 transition"
          >
            <FaShoppingCart className="mr-1" />
            GIỎ HÀNG / 0 đ
          </Link>
          <Link
            to="/login"
            className="bg-green-700 text-white px-4 py-1 rounded font-semibold hover:bg-green-800 transition"
          >
            ĐĂNG NHẬP
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-green-700 text-xl ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Unified Nav (Static + Categories) - Desktop */}
      <nav className="hidden md:flex flex-wrap justify-center gap-6 py-2 border-t border-gray-200 text-sm font-medium text-gray-800">
        {/* Static Nav Items */}
        {staticNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-1 hover:text-green-700 hover:scale-105 transition"
          >
            {item.icon} {item.name}
          </Link>
        ))}

        {/* Category Nav Items with dropdown */}
        {categories.map((cat) => (
          <div key={cat.name} className="relative group">
            <Link
              to={cat.path}
              className="flex items-center gap-1 hover:text-green-700 hover:scale-105 transition"
            >
              {cat.icon} {cat.name}
            </Link>
            {cat.children.length > 0 && (
<div className="absolute left-0 top-full pt-2 bg-white shadow rounded hidden group-hover:block min-w-[180px] z-50">
                {cat.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 text-sm text-gray-800 transition"
                    onClick={() => setMobileOpen(false)} // Close mobile menu on click
                  >
                    {child.icon} {child.name}
                    <FaAngleRight className="ml-auto text-xs" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden px-4 py-3 border-t border-gray-100 bg-white shadow space-y-4">
          <div className="space-y-2">
            {staticNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 text-gray-800 hover:text-green-700 transition"
                                          onClick={() => setMobileOpen(!mobileOpen)}

              >
                {item.icon} {item.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name}>
                <Link
                  to={cat.path}
                  className="flex items-center gap-2 py-2 font-semibold text-green-800"
                >
                  {cat.icon} {cat.name}
                </Link>
                {cat.children.length > 0 && (
                  <div className="ml-4 border-l border-gray-200 pl-2 space-y-1">
                    {cat.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-700 transition"
                      >
                        <FaAngleRight className="text-xs" /> {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile search */}
          <div className="flex mt-4 border rounded overflow-hidden">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button className="bg-green-700 text-white px-3 py-2">
              <FaSearch />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
