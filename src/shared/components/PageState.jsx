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
      title: "Đang tải dữ liệu",
      description: "Vui lòng đợi trong giây lát.",
    },
    error: {
      title: "Không thể tải dữ liệu",
      description: "Vui lòng thử lại hoặc kiểm tra kết nối.",
    },
    empty: {
      title: "Chưa có dữ liệu",
      description: "Nội dung sẽ hiển thị tại đây khi có dữ liệu mới.",
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
