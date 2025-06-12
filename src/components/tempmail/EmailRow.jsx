import React from 'react'
import moment from 'moment'

const EmailRow = ({ email, onClick }) => {
  const { senderName, from, subject, createdAt } = email
  const timeAgo = moment(createdAt).fromNow()

  return (
    <tr
      onClick={() => onClick(email.id)}
      className="border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer"
    >
      <td className="py-3 px-4 text-sm font-semibold text-white">
        <p>{senderName || 'Unknown'}</p>
        <p className="text-gray-400 text-xs">{from}</p>
      </td>
      <td className="py-3 px-4 text-sm text-green-400 max-w-[300px] truncate">
        {subject}
      </td>
      <td className="py-3 px-4 text-sm text-gray-400 whitespace-nowrap">
        {timeAgo}
      </td>
    </tr>
  )
}

export default EmailRow
