// src/components/common/Header.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false); // Đóng menu trên mobile sau khi tìm kiếm
    }
  };

  // Toggle menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Tính số lượng sản phẩm trong giỏ hàng
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyShop
        </Link>

        {/* Thanh tìm kiếm (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-4 max-w-md"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <FaSearch />
            </button>
          </div>
        </form>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Sản phẩm
          </Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/stock"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Kho hàng
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Đơn hàng
                  </Link>
                  <Link
                    to="/admin/payment-codes"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Mã thanh toán
                  </Link>
                  <Link
                    to="/admin/posts"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Bài viết
                  </Link>
                  <Link
                    to="/admin/coupons"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Coupon
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/order-history"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Lịch sử mua
                  </Link>
                  <Link
                    to="/share"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Chia sẻ
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Liên hệ
                  </Link>
                </>
              )}
            </>
          ) : null}
        </nav>

        {/* Giỏ hàng & Tài khoản */}
        <div className="flex items-center space-x-4">
          {/* Giỏ hàng */}
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
            <FaShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Tài khoản */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700">
                <img
                  src={user.avatar || 'https://via.placeholder.com/32'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:inline text-sm">{user.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Hồ sơ
                </Link>
                <Link
                  to="/payment-history"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Lịch sử thanh toán
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 text-sm"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
              >
                Đăng ký
              </Link>
            </>
          )}

          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {/* Tìm kiếm (Mobile) */}
            <form onSubmit={handleSearch} className="flex">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* Menu Links */}
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600"
              onClick={toggleMenu}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600"
              onClick={toggleMenu}
            >
              Sản phẩm
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/stock"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Kho hàng
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Đơn hàng
                    </Link>
                    <Link
                      to="/admin/payment-codes"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Mã thanh toán
                    </Link>
                    <Link
                      to="/admin/posts"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Bài viết
                    </Link>
                    <Link
                      to="/admin/coupons"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Coupon
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/order-history"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Lịch sử mua
                    </Link>
                    <Link
                      to="/share"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Chia sẻ
                    </Link>
                    <Link
                      to="/contact"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Liên hệ
                    </Link>
                  </>
                )}
              </>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;