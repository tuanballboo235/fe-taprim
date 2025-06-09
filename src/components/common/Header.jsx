import { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-xl font-bold text-blue-600">MyShop</div>

          {/* Nav links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-600 transition">Sản phẩm</a>
            <a href="#" className="hover:text-blue-600 transition">Lấy mail</a>
            <a href="#" className="hover:text-blue-600 transition">Tra cứu đơn</a>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center border border-gray-300 rounded overflow-hidden">
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
            className="md:hidden text-xl text-blue-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden space-y-4 pb-4">
            <nav className="flex flex-col gap-2">
              <a href="#" className="hover:text-blue-600 transition">Sản phẩm</a>
              <a href="#" className="hover:text-blue-600 transition">Lấy mail</a>
              <a href="#" className="hover:text-blue-600 transition">Tra cứu đơn</a>
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
