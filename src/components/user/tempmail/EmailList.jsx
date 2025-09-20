import React, { useState } from "react";
import EmailTable from "./EmailTable";
import EmailContentModal from "./EmailContentModal";
import { getEmailContentByEmailId } from "../../../services/api/tempMail";

const EmailList = ({ emails }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleEmailClick = async (id) => {
    try {
      const res = await getEmailContentByEmailId(id);
      console.log("✅ Nội dung nhận được:", res);
      setSelectedEmail(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy nội dung email:", error);
    }
  };

  const closeModal = () => setSelectedEmail(null);

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-4 sm:px-6 md:px-8">
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-8 max-w-5xl mx-auto">
        <EmailTable emails={emails} onEmailClick={handleEmailClick} />
      </div>

      {selectedEmail && (
        <EmailContentModal email={selectedEmail} onClose={closeModal} />
      )}
    </div>
  );
};

export default EmailList;
