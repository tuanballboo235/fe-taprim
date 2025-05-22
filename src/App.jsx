// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestAPI from './pages/Test/TestAPI.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-api" element={<TestAPI />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
