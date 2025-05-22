// src/pages/TestAPI.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestAPI = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <h2>Kết quả API:</h2>
      <ul>
        {data.slice(0, 5).map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestAPI;
