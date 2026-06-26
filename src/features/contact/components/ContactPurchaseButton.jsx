import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Button from "@/shared/components/Button";

export default function ContactPurchaseButton({
  label = "Mua Trực Tiếp",
  items = [
    { text: "Chat Zalo", href: "https://zalo.me/0344665098" },
    { text: "Fanpage Facebook", href: "https://facebook.com/taprim.shop" },
  ],
  className = "",
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
    <div ref={ref} className={`relative inline-block text-left ${className}`}>
      <Button
        variant="info"
        fullWidth
        rightIcon={
          <FaChevronDown
            className={`h-3 w-3 transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        }
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </Button>

      <div
        className={`absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border border-slate-200 bg-white p-1 shadow-lg transition ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {items.map((item) => (
          <a
            key={`${item.href}-${item.text}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            onClick={() => setOpen(false)}
          >
            {item.text}
          </a>
        ))}
      </div>
    </div>
  );
}
