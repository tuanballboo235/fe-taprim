import EmailRow from "@/features/tempmail/components/EmailRow";

const EmailTable = ({ emails, onEmailClick }) => {
  const hasEmails = Array.isArray(emails) && emails.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] table-fixed text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 font-semibold">Nguoi gui</th>
            <th className="px-4 py-3 font-semibold">Tieu de</th>
            <th className="px-4 py-3 font-semibold">Thoi gian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {hasEmails ? (
            emails.map((email) => (
              <EmailRow
                key={email.id}
                email={email}
                onClick={onEmailClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-8 text-center text-slate-500">
                Khong co email nao de hien thi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTable;
