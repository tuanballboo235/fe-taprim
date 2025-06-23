import React, { useState } from 'react'
import { getEmailCodeNetflix } from '../../services/api/tempMail'
import EmailList from '../../components/tempmail/EmailList'

const NetflixGetCode = () => {
  const [transactionCode, setTransactionCode] = useState('')
  const [netflixTemporaryMail, setNetflixTemporaryMail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!transactionCode.trim()) {
      setError('Vui lòng nhập mã giao dịch.')
      return
    }

    setLoading(true)
    setError(null)
    setNetflixTemporaryMail(null)

    try {
      const response = await getEmailCodeNetflix(transactionCode)
      if (response.status === 'Success') {
        setNetflixTemporaryMail(response.data)
      } else {
        setError(response.message || 'Không lấy được dữ liệu.')
      }
    } catch (err) {
      setError('Lỗi khi gọi API!')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      <div className="w-full bg-white shadow-md rounded-lg p-6 sm:p-8 border border-gray-200 sm:max-w-2xl md:max-w-3xl xl:max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
           Lấy mã đăng nhập Netflix Family
        </h2>

        <form
  onSubmit={handleSubmit}
  className="flex flex-col sm:flex-row items-stretch gap-3 mb-6"
>
  <input
    type="text"
    placeholder="Nhập mã thanh toán (bắt đầu bằng TAPR)"
    value={transactionCode}
    onChange={(e) => setTransactionCode(e.target.value)}
    className="px-3 py-2 text-sm w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
  />
  <button
    type="submit"
    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md font-medium shadow-sm transition disabled:opacity-50"
    disabled={loading}
  >
    {loading ? 'Đang tải...' : 'Lấy mã'}
  </button>
</form>

        {error && (
          <p className="text-red-500 font-medium text-sm mb-4 text-center">{error}</p>
        )}

        {netflixTemporaryMail && netflixTemporaryMail.length > 0 ? (
          <EmailList emails={netflixTemporaryMail} />
        ) : (
          !loading &&
          !error && (
            <p className="text-sm text-gray-500 text-center">
              Không có mã đăng nhập nào được tìm thấy.
            </p>
          )
        )}
      </div>
    </div>
  )
}

export default NetflixGetCode
