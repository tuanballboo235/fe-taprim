import React from "react";
import ProductCard from "../../components/product/ProductCard";
const ProductList = () => {
   const products = [
    {
      id: 1,
      image: '/vite.svg',
      title: 'Quizlet 1 tháng',
      price: 2000000,
      salePrice: 0,
      isSale: true,
      rating: 4.5,
      buttonLabel: 'Add to cart',
    },
    {
      id: 2,
      image: '/vite.svg',
      title: 'Canva Pro 1 tháng',
      price: 500000,
      salePrice: 0,
      isSale: true,
      rating: 4.2,
      buttonLabel: 'Add to cart',
    },
    {
      id: 3,
      image: '/vite.svg',
      title: 'Netflix 1 tháng',
      price: 1500000,
      salePrice: 1000000,
      isSale: true,
      rating: 5,
      buttonLabel: 'Select options',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
       <ProductCard
  key={product.id}
  image={product.image}
  title={product.title}
  price={product.price}
  salePrice={product.salePrice}
  isSale={product.isSale}
  rating={product.rating}
  onViewDetail={() => alert(`Xem chi tiết: ${product.title}`)}
  onCheckout={() => alert(`Thanh toán: ${product.title}`)}
/>
        ))}
      </div>
    </div>
  )
};

export default ProductList;
