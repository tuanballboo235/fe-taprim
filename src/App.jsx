import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/useFetch'; // đảm bảo file này tồn tại
import Home from './pages/user/Home.jsx';
import Header from './components/common/Header.jsx';
import ProductList from './pages/user/ProductList.jsx';
import 'react-toastify/dist/ReactToastify.css';
import NetflixUpdateHouseMail from './pages/user/NetflixUpdateHouseMail.jsx';
import NetflixGetCode from './pages/user/NetflixGetCode.jsx';
import OrderLookupPage from './pages/user/OrderLookUp.jsx';
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/netflix-mail" element={<NetflixUpdateHouseMail />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/netflix-code" element={<NetflixGetCode />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />

          <Route path="/" element={<ProductList />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
