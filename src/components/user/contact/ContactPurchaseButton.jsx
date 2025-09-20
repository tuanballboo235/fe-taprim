import React, { useEffect, useRef, useState } from "react";

export default function ContactPurchaseButton({
  label = "Liên hệ mua hàng",
  items = [
    { text: "Chat Zalo", href: "https://zalo.me/0344665098" },
    { text: "Fanpage Facebook", href: "https://facebook.com/taprim.shop" },
  ],
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Click outside + ESC
  useEffect(() => {
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium text-sm w-full sm:w-auto transition flex justify-between items-center"
      >
        {label}
        <svg
          viewBox="0 0 20 20"
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.16l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-1 transition-all duration-150 z-50
        ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {items.map((it, i) => (
          <a
            key={i}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            {it.text}
          </a>
        ))}
      </div>
    </div>
  );
}
