import React, { useEffect, useRef, useState } from "react";

export default function SupportButton({
  zaloUrl = "https://zalo.me/0344665098",
  fanpageUrl = "https://facebook.com/taprim.shop",
  label = "Hỗ trợ",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // click outside
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Dropdown */}
      <div
        className={[
          "origin-bottom-right transition-all duration-200",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-2 w-44">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition text-sm text-gray-800"
          >
            {/* Zalo icon (generic chat bubble) */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.02 2 10.97c0 2.83 1.48 5.37 3.87 7.01-.2.79-.66 2.54-.7 2.7-.04.18.06.36.23.4.16.04.31-.06.39-.13.1-.09 2.18-2.1 2.98-2.85 1.07.3 2.2.47 3.23.47 5.52 0 10-4.02 10-8.97C22 6.02 17.52 2 12 2z" />
            </svg>
            Zalo
          </a>
          <a
            href={fanpageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition text-sm text-gray-800"
          >
            {/* Facebook icon */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
            >
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.48-3.89 3.76-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.9h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94z" />
            </svg>
            Fanpage
          </a>
        </div>
      </div>

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={label}
        className={[
          "inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg",
          "bg-teal-600 hover:bg-teal-700 text-white transition select-none",
        ].join(" ")}
      >
        {/* Phone/chat icon */}
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M2 5a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H8l-3.29 3.29A1 1 0 0 1 3 16.59V13a3 3 0 0 1-1-2V5zM14 8h5a3 3 0 0 1 3 3v7.59a1 1 0 0 1-1.71.71L17 17h-3a3 3 0 0 1-3-3v-1h3a3 3 0 0 0 3-3V8z" />
        </svg>
        <span className="font-semibold">{label}</span>
        <svg
          viewBox="0 0 20 20"
          className={[
            "w-4 h-4 transition-transform",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
        </svg>
      </button>
    </div>
  );
}
