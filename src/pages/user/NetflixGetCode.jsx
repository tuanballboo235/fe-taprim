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
    <div className="bg-black text-white min-h-screen px-4 py-6 w-full">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">📩 Lấy Mã Đăng Nhập Netflix Family</h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Nhập mã giao dịch"
            value={transactionCode}
            onChange={(e) => setTransactionCode(e.target.value)}
            className="px-4 py-2 w-full sm:flex-1 rounded bg-white text-black placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Lấy mã'}
          </button>
        </form>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {netflixTemporaryMail && netflixTemporaryMail.length > 0 ? (
          <EmailList emails={netflixTemporaryMail} />
        ) : (
          !loading && !error && (
            <p className="text-gray-400">Không có mã đăng nhập nào được tìm thấy.</p>
          )
        )}
      </div>
    </div>
  )
}

export default NetflixGetCode
