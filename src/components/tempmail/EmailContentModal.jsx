import React from 'react'

const EmailContentModal = ({ email, onClose }) => {
  if (!email) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose} // 👈 click nền sẽ đóng
    >
      <div
        className="bg-white text-black p-6 rounded-lg max-w-3xl w-full relative shadow-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // 👈 ngăn click bên trong bị "bubble"
      >
       <button
  className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold transition-transform transform hover:scale-125"
  onClick={onClose}
>
  ×
</button>
        <h2 className="text-xl font-bold mb-4">{email.subject}</h2>
        <p className="text-sm text-gray-500 mb-2">From: {email.from}</p>

        <div
          className="prose prose-sm max-w-full"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>
    </div>
  )
}

export default EmailContentModal
