import React from 'react'
import EmailRow from './EmailRow'

const EmailTable = ({ emails, onEmailClick }) => {
  const hasEmails = Array.isArray(emails) && emails.length > 0

  return (
    <table className="w-full text-left table-fixed">
      <thead>
        <tr className="border-b border-gray-200 text-gray-600 text-sm">
          <th className="py-2 px-4">Người gửi</th>
          <th className="py-2 px-4">Tiêu đề</th>
          <th className="py-2 px-4">Thời gian</th>
        </tr>
      </thead>
      <tbody>
        {hasEmails ? (
          emails.map((email) => (
            <EmailRow key={email.id} email={email} onClick={onEmailClick} />
          ))
        ) : (
          <tr>
            <td
              colSpan="3"
              className="text-center py-6 text-gray-500 italic"
            >
              Không có email nào để hiển thị.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default EmailTable
