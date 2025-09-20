import React from 'react'

const EmailContentModal = ({ email, onClose }) => {
  if (!email) return null

  return (
    <div
      className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50 px-3"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-800 rounded-xl w-full max-w-2xl md:max-w-3xl relative shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition hover:scale-110"
          onClick={onClose}
        >
          ×
        </button>

        <div className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{email.subject}</h2>
          <p className="text-sm text-gray-500 mb-4">Từ: {email.from}</p>

          <div
            className="prose prose-sm sm:prose-base max-w-full text-gray-700"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </div>
    </div>
  )
}

export default EmailContentModal
