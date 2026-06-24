import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getEmailCodeNetflix } from "@/features/tempmail/api/tempMail";
import EmailList from "@/features/tempmail/components/EmailList";
import Button from "@/shared/components/Button";
import PageState from "@/shared/components/PageState";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const NetflixGetCode = () => {
  const [transactionCode, setTransactionCode] = useState("");
  const [netflixTemporaryMail, setNetflixTemporaryMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!transactionCode.trim()) {
      notify.warning("Vui long nhap ma giao dich.");
      return;
    }

    setLoading(true);
    setError(null);
    setNetflixTemporaryMail(null);

    try {
      const response = await getEmailCodeNetflix(transactionCode);

      if (response.status === "Success") {
        setNetflixTemporaryMail(response.data);
        notify.success("Da lay ma Netflix.");
      } else {
        const message = response.message || "Khong lay duoc du lieu.";
        setError(message);
        notify.error(message);
      }
    } catch (err) {
      const message = getApiErrorMessage(err, "Loi khi goi API.");
      setError(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Lay ma dang nhap Netflix Family
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Nhap ma giao dich de tra cuu email code dang nhap.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <input
            type="text"
            placeholder="Nhap ma thanh toan bat dau bang TAPR"
            value={transactionCode}
            onChange={(event) => setTransactionCode(event.target.value)}
            className="min-h-10 min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />
          <Button
            type="submit"
            variant="danger"
            isLoading={loading}
            leftIcon={<FaSearch />}
            className="sm:w-auto"
          >
            {loading ? "Dang tai..." : "Lay ma"}
          </Button>
        </form>
      </div>

      <div className="mt-5">
        {loading && (
          <PageState type="loading" description="Dang tra cuu email code..." />
        )}

        {!loading && error && (
          <PageState
            type="error"
            title="Khong the lay ma"
            description={error}
          />
        )}

        {!loading && !error && netflixTemporaryMail?.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <EmailList emails={netflixTemporaryMail} />
          </div>
        )}

        {!loading && !error && netflixTemporaryMail?.length === 0 && (
          <PageState
            type="empty"
            title="Khong tim thay ma"
            description="Chua co ma dang nhap nao cho giao dich nay."
          />
        )}
      </div>
    </section>
  );
};

export default NetflixGetCode;
