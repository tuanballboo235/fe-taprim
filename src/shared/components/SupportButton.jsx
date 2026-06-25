import { useEffect, useRef, useState } from "react";
import { ChevronDown, Facebook, MessageCircle } from "lucide-react";

export default function SupportButton({
  zaloUrl = "https://zalo.me/0344665098",
  fanpageUrl = "https://facebook.com/taprim.shop",
  label = "Ho tro",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);

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
      className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <div
        className={`origin-bottom-right transition ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Zalo
          </a>
          <a
            href={fanpageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <Facebook className="h-5 w-5 text-blue-700" />
            Fanpage
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={label}
        className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-green-800"
      >
        <MessageCircle className="h-5 w-5" />
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
}
