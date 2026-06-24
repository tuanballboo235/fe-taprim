import Button from "@/shared/components/Button";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

const PageState = ({
  type = "loading",
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const defaults = {
    loading: {
      title: "Dang tai du lieu",
      description: "Vui long doi trong giay lat.",
    },
    error: {
      title: "Khong the tai du lieu",
      description: "Vui long thu lai hoac kiem tra ket noi.",
    },
    empty: {
      title: "Chua co du lieu",
      description: "Noi dung se hien thi tai day khi co du lieu moi.",
    },
  };

  const content = defaults[type] ?? defaults.loading;

  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-10 text-center">
      <div className="max-w-sm">
        {type === "loading" ? (
          <LoadingSpinner text={description ?? content.description} size="lg" />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-900">
              {title ?? content.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {description ?? content.description}
            </p>
            {actionLabel && onAction && (
              <Button className="mt-5" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PageState;
