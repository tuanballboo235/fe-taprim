const toneClasses = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    accent: "text-emerald-700",
    hover: "hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-800",
  },
  sky: {
    icon: "bg-sky-50 text-sky-700",
    accent: "text-sky-700",
    hover: "hover:border-sky-300 hover:bg-sky-50/70 hover:text-sky-800",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    accent: "text-amber-700",
    hover: "hover:border-amber-300 hover:bg-amber-50/70 hover:text-amber-800",
  },
  rose: {
    icon: "bg-rose-50 text-rose-700",
    accent: "text-rose-700",
    hover: "hover:border-rose-300 hover:bg-rose-50/70 hover:text-rose-800",
  },
  slate: {
    icon: "bg-slate-100 text-slate-700",
    accent: "text-slate-800",
    hover: "hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950",
  },
};

const getTone = (tone = "emerald") => toneClasses[tone] ?? toneClasses.emerald;

export function DashboardLayout({ children, className = "" }) {
  return (
    <section className={["space-y-5", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  icon,
  badges = [],
  actions,
}) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          {icon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:h-14 sm:w-14">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-sm font-semibold text-emerald-700">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            )}
            {badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardStats({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const tone = getTone(item.tone);

        return (
          <div
            key={item.label}
            className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 truncate text-2xl font-semibold text-slate-950">
                  {item.value}
                </p>
              </div>
              {item.icon && (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                >
                  {item.icon}
                </span>
              )}
            </div>
            {item.description && (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {item.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DashboardActions({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const tone = getTone(item.tone);
        const Component = item.as ?? "a";
        const props = item.to ? { to: item.to } : { href: item.href ?? "#" };

        return (
          <Component
            key={item.label}
            {...props}
            className={`group rounded-xl border border-slate-300 bg-white p-4 text-left shadow-sm transition ${tone.hover}`}
          >
            <div className="flex items-start gap-3">
              {item.icon && (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                >
                  {item.icon}
                </span>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-slate-950 transition group-hover:text-inherit">
                  {item.label}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </Component>
        );
      })}
    </div>
  );
}

export function DashboardPanel({
  title,
  description,
  icon,
  action,
  children,
  className = "",
}) {
  return (
    <div
      className={[
        "rounded-xl border border-slate-300 bg-white shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(title || description || icon || action) && (
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              {icon && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  {icon}
                </span>
              )}
              <div className="min-w-0">
                {title && (
                  <h2 className="text-lg font-semibold text-slate-950">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
