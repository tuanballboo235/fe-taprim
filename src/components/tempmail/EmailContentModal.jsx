import React from 'react'

const EmailContentModal = ({ email, onClose }) => {
  if (!email) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2"
      onClick={onClose}
    >
      <div
        className="bg-white text-black rounded-lg w-full max-w-md sm:max-w-2xl md:max-w-3xl relative shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold transition-transform transform hover:scale-125"
          onClick={onClose}
        >
          ×
        </button>

        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">{email.subject}</h2>
          <p className="text-sm text-gray-500 mb-4">From: {email.from}</p>

          <div
            className="prose prose-sm max-w-full"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </div>
    </div>
  )
}

export default EmailContentModal
