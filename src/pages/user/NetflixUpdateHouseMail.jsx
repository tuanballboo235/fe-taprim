import React, { useState, useEffect } from 'react'
import { getNetflixUpdateFamily } from '../../services/api/tempMail'
import EmailList from '../../components/tempmail/EmailList'

const NetflixUpdateHouseMail = () => {
  const [netflixTemporaryMail, setNetflixTemporaryMail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getNetflixUpdateFamily()
        setNetflixTemporaryMail(data)
      } catch (err) {
        setError('Lỗi khi gọi API!')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen w-full px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      <div className="w-full bg-white shadow-md rounded-lg p-6 sm:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Cập nhật hộ gia đình Netflix Family
        </h2>

        {loading && (
          <p className="text-sm text-gray-500 text-center">Đang tải dữ liệu...</p>
        )}

        {error && (
          <p className="text-red-500 font-medium text-sm text-center">{error}</p>
        )}

        {!loading && !error && Array.isArray(netflixTemporaryMail?.data) && (
          <EmailList emails={netflixTemporaryMail.data} />
        )}

        
      </div>
    </div>
  )
}

export default NetflixUpdateHouseMail
