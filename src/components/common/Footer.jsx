import { Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans">
      {/* Container */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Slogan */}
        <div>
          <h1 className="text-2xl font-bold text-white">TAPRIM Shop</h1>
          <p className="mt-3 text-sm leading-relaxed">
            Cung cấp tài khoản học tập, giải trí và các dịch vụ số.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">
            Liên kết nhanh
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-teal-400 transition">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-teal-400 transition">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-teal-400 transition">
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-teal-400 transition">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Liên hệ</h2>
          <p className="text-sm mb-2">Hà Nội</p>
          <p className="text-sm mb-2">
            Email (for work): taprimshop@windmedia.vn
          </p>
          <p className="text-sm">Zalo: 0344665098</p>

          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://facebook.com/taprim.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400"
            >
              <Facebook size={20} />
            </a>

            <a href="https://youtube.com" className="hover:text-teal-400">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} TAPRIM. All rights reserved.
      </div>
    </footer>
  );
}
