import React from 'react'
import EmailRow from './EmailRow'

const EmailTable = ({ emails, onEmailClick }) => {
  return (
    <table className="w-full text-left table-fixed">
      <thead>
        <tr className="border-b border-gray-600 text-gray-400 text-sm">
          <th className="py-2 px-4">Sender</th>
          <th className="py-2 px-4">Subject</th>
          <th className="py-2 px-4">Time</th>
        </tr>
      </thead>
      <tbody>
        {emails.map((email) => (
          <EmailRow key={email.id} email={email} onClick={onEmailClick} />
        ))}
      </tbody>
    </table>
  )
}

export default EmailTable
