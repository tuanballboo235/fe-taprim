import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/useFetch'; // đảm bảo file này tồn tại
import Home from './pages/user/HomePage.jsx';
import Header from './components/common/Header.jsx';
import ProductListPage from './pages/user/ProductListPage.jsx';
import 'react-toastify/dist/ReactToastify.css';
import NetflixUpdateHouseMailPage from './pages/user/NetflixUpdateHouseMailPage.jsx';
import NetflixGetCodePage from './pages/user/NetflixGetCodePage.jsx';
import OrderLookupPage from './pages/user/OrderLookUpPage.jsx';
import CreateProductPage from './pages/admin/CreateProductPage.jsx';
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* USER ROUTE*/}
          <Route path="/home" element={<Home />} />
          <Route path="/netflix-mail" element={<NetflixUpdateHouseMailPage />} />
          <Route path="/product" element={<ProductListPage />} />
          <Route path="/netflix-code" element={<NetflixGetCodePage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />

          {/*ADMIN ROUTE*/}
          <Route path="/admin-create-product" element={<CreateProductPage />} />
          <Route path="/" element={<ProductListPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
