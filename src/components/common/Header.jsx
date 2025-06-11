import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md text-gray-800 w-full">
      <div className="w-full">
        {/* Top row */}
        <div className="flex items-center justify-between py-4 px-4 md:px-8">
          {/* ✅ LOGO: trái cố định */}
          <Link to="/home" className="text-xl font-bold text-blue-600 flex-shrink-0">
          Link RIM
          </Link>

          {/* ✅ NAV: giữa màn hình */}
          <nav className="hidden md:flex flex-1 justify-center gap-6 text-sm font-medium">
            <Link to="/product" className="hover:text-blue-600 transition">Sản Phẩm</Link>
            <Link to="/netflix-mail" className="hover:text-blue-600 transition">Lấy Mail Netflix</Link>
            <Link to="/chatgpt-code" className="hover:text-blue-600 transition">Lấy Code Chatgpt</Link>

            <Link to="#" className="hover:text-blue-600 transition">Tra cứu đơn</Link>
            <Link to="#" className="hover:text-blue-600 transition">Liên hệ</Link>

          </nav>

          {/* ✅ SEARCH: sát phải */}
          <div className="hidden md:flex items-center border border-gray-300 rounded overflow-hidden ml-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-3 py-2 text-sm outline-none"
            />
            <button className="bg-blue-600 text-white px-3 py-2">
              <FaSearch />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-xl text-blue-600 ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 space-y-4">
            <nav className="flex flex-col gap-2">
              <a href="#" className="hover:text-blue-600 transition">Mua hàng</a>
              <a href="#" className="hover:text-blue-600 transition">Lấy mail</a>
              <a href="#" className="hover:text-blue-600 transition">Tra cứu đơn</a>     
              <a href="#" className="hover:text-blue-600 transition">Liên hệ</a>

            </nav>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="px-3 py-2 text-sm w-full outline-none"
              />
              <button className="bg-blue-600 text-white px-3 py-2">
                <FaSearch />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
