import React, { useState, useEffect } from 'react'
import {getNetflixUpdateFamily} from '../../services/api/tempMail'
import EmailList from '../../components/tempmail/EmailList'

const TempMail = () => {
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
  <div className="bg-black text-white px-4 py-6 w-full">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Lấy thông tin Netflix Family</h2>

      {loading && <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {!loading && !error && Array.isArray(netflixTemporaryMail?.data) && (
        <EmailList emails={netflixTemporaryMail.data} />
      )}
    </div>
  </div>
)


}

export default TempMail
