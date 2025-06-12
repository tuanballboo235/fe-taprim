import React, { useEffect, useState } from 'react'
import ProductCard from "../../components/product/ProductCard";
import getAllProducts  from '../../services/api/productService'
import Carousel from '../../components/caroselBanner/Carousel';
const ProductList = () => {
  const [products, setProducts] = useState([])
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error('Lỗi khi fetch sản phẩm:', error)
      }
    }

    fetchData()
  }, [])
const images = [
  '../../assets/images/483967539_2068210710352289_1535954025462080168_n.jpg',
  '../../assets/images/483967539_2068210710352289_1535954025462080168_n.jpg',
  '../../assets/images/s.jpg',
];
  return (
        <>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            image={`${apiUrl}${product.productImage}`}
            title={product.productName}s
            price={product.price}
            salePrice={'500000'}
            isSale={product.isSale}
            onViewDetail={() => alert(`Xem chi tiết: ${product.title}`)}
            onCheckout={() => alert(`Thanh toán: ${product.title}`)}
          />
        ))}
      </div>
    </div>
    <div className="max-w-5xl mx-auto mt-6">
      <Carousel images={images} autoSlide={true} autoSlideInterval={4000} />
    </div>

    </>
  )
};

export default ProductList;
