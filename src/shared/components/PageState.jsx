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
      title: "Đang tải du lieu",
      description: "Vui lòng doi trong giay lat.",
    },
    error: {
      title: "Không thể tai du lieu",
      description: "Vui lòng thu lai hoac kiem tra ket noi.",
    },
    empty: {
      title: "Chưa có du lieu",
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
