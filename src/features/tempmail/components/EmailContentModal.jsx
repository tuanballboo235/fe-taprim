const EmailContentModal = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200 p-4 pr-12 sm:p-5 sm:pr-14">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {email.subject || "Không có tiêu đề"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Từ: {email.from || "-"}</p>
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          onClick={onClose}
          aria-label="Đóng"
        >
          x
        </button>

        <div
          className="max-w-none break-words p-4 text-sm leading-6 text-slate-700 sm:p-5"
          dangerouslySetInnerHTML={{ __html: email.body || "" }}
        />
      </div>
    </div>
  );
};

export default EmailContentModal;
