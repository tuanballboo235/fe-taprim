import React from 'react'

const EmailContentModal = ({ email, onClose }) => {
  if (!email) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose} // 👈 click nền sẽ đóng
    >
      <div
  className="bg-white text-black p-4 sm:p-6 rounded-lg w-[95vw] max-w-3xl relative shadow-lg overflow-y-auto max-h-[90vh]"
  onClick={(e) => e.stopPropagation()}
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
