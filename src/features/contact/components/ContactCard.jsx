import { FaFacebookF, FaPhone, FaUsers } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const contactItems = [
  {
    key: "facebookUrl",
    label: "Facebook ca nhan",
    icon: <FaFacebookF />,
    className: "text-blue-700",
  },
  {
    key: "zaloUrl",
    label: "Chat Zalo",
    icon: <SiZalo />,
    className: "text-blue-600",
  },
  {
    key: "fbGroupUrl",
    label: "Page Facebook",
    icon: <FaUsers />,
    className: "text-purple-700",
  },
];

const ContactCard = ({ facebookUrl, zaloUrl, phoneNumber, fbGroupUrl }) => {
  const values = { facebookUrl, zaloUrl, fbGroupUrl };

  return (
    <section className="mx-auto max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Liên hệ TAPRIM</h2>
      <p className="mt-1 text-sm text-slate-500">
        Chọn kênh hỗ trợ phù hợp để shop tư vấn nhanh hơn.
      </p>

      <div className="mt-4 space-y-2">
        {contactItems.map((item) => {
          const href = values[item.key];
          if (!href) return null;

          return (
            <a
              key={item.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className={item.className}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}

        {phoneNumber && (
          <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
            <span className="text-green-700">
              <FaPhone />
            </span>
            {phoneNumber}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactCard;
