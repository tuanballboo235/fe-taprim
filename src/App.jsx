import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/useFetch'; // đảm bảo file này tồn tại
import Home from './pages/user/HomePage.jsx';
import Header from './components/common/Header.jsx';
import ProductListPage from './pages/user/ProductListPage.jsx';

import NetflixUpdateHouseMailPage from './pages/user/NetflixUpdateHouseMailPage.jsx';
import NetflixGetCodePage from './pages/user/NetflixGetCodePage.jsx';
import OrderLookupPage from './pages/user/OrderLookUpPage.jsx';
import CreateProductPage from './pages/admin/CreateProductPage.jsx';
import ProductAccountPage from './pages/admin/ProductAccountPage.jsx';
import ProductDetailPage from './components/product/ProductDetails.jsx';

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        
        {/* ✅ Toast container để hiển thị thông báo toàn app */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
            toastStyle={{ marginTop: "100px" }} // Đẩy toast xuống dưới header

          pauseOnHover
          draggable
          theme="colored"
        />
        <Routes>
          {/* USER ROUTE*/}
          <Route path="/home" element={<Home />} />
          <Route path="/netflix-mail" element={<NetflixUpdateHouseMailPage />} />
          <Route path="/product" element={<ProductListPage />} />
          <Route path="/netflix-code" element={<NetflixGetCodePage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/*ADMIN ROUTE*/}
          <Route path="/admin-create-product" element={<CreateProductPage />} />
          <Route path="/admin-product-account/:productId" element={<ProductAccountPage />} />

          {/* Redirect to home if no match */}
          <Route path="/" element={<ProductListPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
