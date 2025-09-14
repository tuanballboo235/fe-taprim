import React, { useState, useLayoutEffect } from "react";

/**
 * TickerNotice – fixed, mượt, trong suốt
 */
export default function TickerNotice({
  message = "Website đang trong giai đoạn hoàn thiện. Nếu quý khách gặp cần góp ý, vui lòng nhắn shop qua Zalo: 0344665098 hoặc fanpage. Shop xin cảm ơn quý khách!",
  zaloHref = "https://zalo.me/09xxxxxxxx",
  topOffset,
  speed = 500,      // giây cho 1 vòng
  repeats = 20,     // số lần lặp trong mỗi nhóm
  gap = 150,         // 👈 khoảng cách giữa các item (px)
  groupGap = 200,   // 👈 khoảng trống giữa 2 nhóm (px) để đỡ lặp sát
}) {
  const [open, setOpen] = useState(true);
  const [computedTop, setComputedTop] = useState(topOffset ?? 0);

  useLayoutEffect(() => {
    if (topOffset != null) {
      setComputedTop(topOffset);
      return;
    }
    const selectors = ["#site-header", "[data-header]", "header[role='banner']", ".site-header", "header"];
    const el = selectors.map((s) => document.querySelector(s)).find(Boolean);
    if (!el) { setComputedTop(0); return; }

    const update = () => setComputedTop(`${el.getBoundingClientRect().height || 0}px`);
    update();

    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, [topOffset]);

  if (!open) return null;

  const NoticeItem = ({ idx }) => (
    <span key={idx} className="inline-flex items-center">
      <span className="hidden sm:inline-block mr-2 rounded-full px-1.5 py-[1px] border border-amber-300/60 text-amber-700 text-[10px] bg-transparent">
        Thông báo
      </span>
      {zaloHref ? (
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 hover:no-underline"
        >
          {message}
        </a>
      ) : (
        <span className="font-medium">{message}</span>
      )}
    </span>
  );

  return (
    <>
      <div
        className={[
          "ticker-group",
          "fixed left-0 right-0 z-50",
          "bg-transparent border-y border-transparent",
          "text-[11px] sm:text-xs",
          "text-red-700 dark:text-red-300",
          "pointer-events-none",
        ].join(" ")}
        style={{ top: computedTop }}
        role="region"
        aria-label="Thông báo trạng thái website"
        aria-live="polite"
      >
        <div className="relative overflow-hidden px-2.5 sm:px-3 py-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-1.5 w-1.5 rounded-full bg-amber-500 shadow animate-pulse pointer-events-none" />

          <div className="ml-4 mr-10 sm:mr-12">
            <div
              className="marquee__track pointer-events-auto"
              style={{
                ["--duration"]: `${speed}s`,
                ["--gap"]: `${gap}px`,
                ["--group-gap"]: `${groupGap}px`,
              }}
            >
              <div className="marquee__group">
                {Array.from({ length: repeats }).map((_, i) => (
                  <NoticeItem idx={i} key={`g1-${i}`} />
                ))}
              </div>
              <div className="marquee__group" aria-hidden="true">
                {Array.from({ length: repeats }).map((_, i) => (
                  <NoticeItem idx={i} key={`g2-${i}`} />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Đóng thông báo"
            className="pointer-events-auto absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
                       h-6 w-6 rounded-md border border-amber-300/70 bg-white/90 text-amber-700
                       font-bold shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            title="Đóng"
          >
            ×
          </button>
        </div>

        <style>{`
          .marquee__track {
            display: flex;
            width: max-content;
            will-change: transform;
            animation: ticker-scroll var(--duration, 30s) linear infinite;
          }
          .marquee__group {
            display: inline-flex;
            padding-right: var(--group-gap, 0px); /* 👈 khoảng trống giữa 2 nhóm */
          }
          .marquee__group > * {
            margin-right: var(--gap, 28px);      /* 👈 khoảng cách giữa các item */
          }
          .ticker-group:hover .marquee__track { animation-play-state: paused; }
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee__track { animation: none; }
          }
        `}</style>
      </div>

      <div style={{ height: "28px" }} aria-hidden />
    </>
  );
}
