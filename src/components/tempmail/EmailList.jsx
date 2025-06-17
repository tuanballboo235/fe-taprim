import React, { useState } from "react";
import EmailTable from "./EmailTable";
import EmailContentModal from "./EmailContentModal";
import { getEmailContentByEmailId } from "../../services/api/tempMail";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-[#1e1e1e] p-6 rounded-xl shadow-lg">
        <EmailTable emails={emails} onEmailClick={handleEmailClick} />
      </div>

      {selectedEmail && (
        <EmailContentModal email={selectedEmail} onClose={closeModal} />
      )}
    </div>
  );
};

export default EmailList;
