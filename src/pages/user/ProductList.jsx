import React, { useEffect, useState } from 'react'
import ProductCard from "../../components/product/ProductCard";
import getAllProducts  from '../../services/api/productService'
import ProductDetails from '../../components/product/ProductDetail';
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

  return (
        <>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            image={`${apiUrl}${product.productImage}`}
            title={product.productName}
            price={product.price}
            salePrice={'500000'}
            isSale={product.isSale}
           
          />
        ))}
      </div>
    </div>
    {/* <div className="max-w-5xl mx-auto mt-6">
      <Carousel images={images} autoSlide={true} autoSlideInterval={4000} />
    </div> */}
    </>
  )
};

export default ProductList;
