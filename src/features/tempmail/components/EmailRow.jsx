import moment from "moment";

const EmailRow = ({ email, onClick }) => {
  const { senderName, from, subject, createdAt } = email;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "-";

  return (
    <tr
      onClick={() => onClick?.(email.id)}
      className="cursor-pointer transition hover:bg-slate-50"
    >
      <td className="px-4 py-3">
        <p className="truncate font-semibold text-slate-900">
          {senderName || "Unknown"}
        </p>
        <p className="truncate text-xs text-slate-500">{from || "-"}</p>
      </td>
      <td className="px-4 py-3 text-blue-700">
        <p className="truncate">{subject || "Khong co tieu de"}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
        {timeAgo}
      </td>
    </tr>
  );
};

export default EmailRow;
