import { useEffect, useState } from "react";
import { getNetflixUpdateFamily } from "@/features/tempmail/api/tempMail";
import EmailList from "@/features/tempmail/components/EmailList";
import PageState from "@/shared/components/PageState";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const NetflixUpdateHouseMail = () => {
  const [netflixTemporaryMail, setNetflixTemporaryMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNetflixUpdateFamily();

        if (isActive) {
          setNetflixTemporaryMail(data);
        }
      } catch (err) {
        const message = getApiErrorMessage(err, "Lỗi khi goi API.");

        if (isActive) {
          setError(message);
          notify.error(message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, []);

  const emails = netflixTemporaryMail?.data ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Cập nhật hộ gia đình Netflix Family
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Danh sách email update family duoc lay tu he thong tam thoi.
        </p>
      </div>

      {loading && (
        <PageState type="loading" description="Đang tải du lieu email..." />
      )}

      {!loading && error && (
        <PageState type="error" title="Không thể tai email" description={error} />
      )}

      {!loading && !error && emails.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <EmailList emails={emails} />
        </div>
      )}

      {!loading && !error && emails.length === 0 && (
        <PageState
          type="empty"
          title="Chưa có email"
          description="Danh sách email se hien thi tai day khi co du lieu."
        />
      )}
    </section>
  );
};

export default NetflixUpdateHouseMail;
