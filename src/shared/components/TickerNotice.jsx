import { useLayoutEffect, useState } from "react";

export default function TickerNotice({
  message = "Website đang trong giai đoạn hoàn thiện. Nếu cần hỗ trợ, vui lòng liên hệ shop qua Zalo: 0344665098 hoặc fanpage.",
  zaloHref = "https://zalo.me/0344665098",
  topOffset,
  speed = 500,
  repeats = 20,
  gap = 150,
  groupGap = 200,
}) {
  const [open, setOpen] = useState(true);
  const [computedTop, setComputedTop] = useState(topOffset ?? 0);

  useLayoutEffect(() => {
    if (topOffset != null) {
      setComputedTop(topOffset);
      return;
    }

    const selectors = [
      "#site-header",
      "[data-header]",
      "header[role='banner']",
      ".site-header",
      "header",
    ];
    const header = selectors
      .map((selector) => document.querySelector(selector))
      .find(Boolean);

    if (!header) {
      setComputedTop(0);
      return;
    }

    const updateTop = () => {
      setComputedTop(`${header.getBoundingClientRect().height || 0}px`);
    };

    updateTop();

    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateTop);
      resizeObserver.observe(header);
    }

    window.addEventListener("resize", updateTop);

    return () => {
      window.removeEventListener("resize", updateTop);
      resizeObserver?.disconnect();
    };
  }, [topOffset]);

  if (!open) return null;

  const NoticeItem = ({ idx }) => (
    <span key={idx} className="inline-flex items-center">
      <span className="mr-2 hidden rounded-full border border-amber-300/70 px-1.5 py-[1px] text-[10px] text-amber-700 sm:inline-block">
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
        className="fixed left-0 right-0 z-50 border-y border-transparent bg-transparent text-[11px] text-red-700 pointer-events-none sm:text-xs"
        style={{ top: computedTop }}
        role="region"
        aria-label="Thông báo trạng thái website"
        aria-live="polite"
      >
        <div className="relative overflow-hidden px-3 py-1">
          <span className="pointer-events-none absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-500 shadow animate-pulse" />

          <div className="ml-4 mr-10 sm:mr-12">
            <div
              className="marquee__track pointer-events-auto"
              style={{
                "--duration": `${speed}s`,
                "--gap": `${gap}px`,
                "--group-gap": `${groupGap}px`,
              }}
            >
              <div className="marquee__group">
                {Array.from({ length: repeats }).map((_, index) => (
                  <NoticeItem idx={index} key={`g1-${index}`} />
                ))}
              </div>
              <div className="marquee__group" aria-hidden="true">
                {Array.from({ length: repeats }).map((_, index) => (
                  <NoticeItem idx={index} key={`g2-${index}`} />
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng thông báo"
            className="pointer-events-auto absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-amber-300/70 bg-white/90 font-bold text-amber-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/70"
            title="Dong"
          >
            x
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
            padding-right: var(--group-gap, 0px);
          }
          .marquee__group > * {
            margin-right: var(--gap, 28px);
          }
          .marquee__track:hover {
            animation-play-state: paused;
          }
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
