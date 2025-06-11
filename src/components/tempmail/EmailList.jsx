import React from 'react'
import EmailTable from './EmailTable'

const EmailList = ({ emails }) => {
  return (
    <div className="bg-[#121212] text-white min-h-screen font-sans w-full px-6 py-4">
      {/* container không giới hạn max-width */}
      <div className="w-full bg-[#1e1e1e] p-0 rounded-md shadow overflow-x-auto">
        <EmailTable emails={emails} />
      </div>
    </div>
  )
}

export default EmailList
