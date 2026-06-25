import { useState } from "react";
import EmailTable from "@/features/tempmail/components/EmailTable";
import EmailContentModal from "@/features/tempmail/components/EmailContentModal";
import { getEmailContentByEmailId } from "@/features/tempmail/api/tempMail";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const EmailList = ({ emails }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleEmailClick = async (id) => {
    notify.loading("Đang tải noi dung email...");

    try {
      const response = await getEmailContentByEmailId(id);
      setSelectedEmail(response?.data ?? response);
      notify.close();
    } catch (error) {
      notify.close();
      notify.error(getApiErrorMessage(error, "Không thể tai noi dung email."));
    }
  };

  return (
    <>
      <EmailTable emails={emails} onEmailClick={handleEmailClick} />

      {selectedEmail && (
        <EmailContentModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </>
  );
};

export default EmailList;
