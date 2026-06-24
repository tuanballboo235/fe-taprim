import { Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold text-white">TAPRIM Shop</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Cung cap tai khoan hoc tap, giai tri va cac dich vu so voi quy
            trinh mua hang gon gang.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold text-white">
            Lien ket nhanh
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/product" className="transition hover:text-green-400">
                San pham
              </Link>
            </li>
            <li>
              <Link
                to="/order-lookup"
                className="transition hover:text-green-400"
              >
                Tra cuu don
              </Link>
            </li>
            <li>
              <Link
                to="/netflix-code"
                className="transition hover:text-green-400"
              >
                Mail Login Netflix
              </Link>
            </li>
            <li>
              <Link
                to="/netflix-mail"
                className="transition hover:text-green-400"
              >
                Mail Update Netflix
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold text-white">Lien he</h2>
          <p className="text-sm text-slate-400">Email: taprimshop@gmail.com</p>
          <p className="mt-2 text-sm text-slate-400">Zalo: 0344665098</p>

          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://facebook.com/taprim.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-green-400"
              title="Facebook"
            >
              <Facebook size={20} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-green-400"
              title="Youtube"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} TAPRIM. All rights reserved.
      </div>
    </footer>
  );
}
