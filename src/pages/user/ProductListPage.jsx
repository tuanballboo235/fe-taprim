import React from "react";
import CategorySection from "../../components/category/CategorySection";

const ProductList = () => {
  // Dữ liệu mẫu tĩnh cho từng danh mục
  const mockData = [
    {
      title: "Game trên Steam",
      description: "Những trò chơi được đánh giá tốt, nội dung hấp dẫn đang chờ bạn",
      viewAllLink: "/category/steam",
      products: [
        {
          id: 1,
          name: "ELDEN RING Shadow of the Erdtree",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 99000,
          originalPrice: 1690000,
          discount: 94,
          inStock: true,
        },
        {
          id: 2,
          name: "Roblox Pet",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 15000,
          originalPrice: 60000,
          discount: 75,
          inStock: false,
        },
        {
          id: 3,
          name: "Split Fiction - Thuê game 1 ngày",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 23000,
          originalPrice: 899000,
          discount: 97,
          inStock: true,
        },
          {
          id: 3,
          name: "Split Fiction - Thuê game 1 ngày",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 23000,
          originalPrice: 899000,
          discount: 97,
          inStock: true,
        },  {
          id: 3,
          name: "Split Fiction - Thuê game 1 ngày",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 23000,
          originalPrice: 899000,
          discount: 97,
          inStock: true,
        },
          {
          id: 3,
          name: "Split Fiction - Thuê game 1 ngày",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 23000,
          originalPrice: 899000,
          discount: 97,
          inStock: true,
        },
          {
          id: 3,
          name: "Split Fiction - Thuê game 1 ngày",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 23000,
          originalPrice: 899000,
          discount: 97,
          inStock: true,
        },
        
      ],
    },
    {
      title: "Ứng dụng giải trí",
      description: "YouTube, Spotify, Netflix và nhiều hơn nữa",
      viewAllLink: "/category/giai-tri",
      products: [
        {
          id: 4,
          name: "YouTube Premium - 6 tháng",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 69000,
          originalPrice: 149000,
          discount: 54,
          inStock: true,
        },
        {
          id: 5,
          name: "Spotify Premium - Cá nhân",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 99000,
          originalPrice: 149000,
          discount: 33,
          inStock: true,
        },
      ],
    },
     {
      title: "Ứng dụng giải trí",
      description: "YouTube, Spotify, Netflix và nhiều hơn nữa",
      viewAllLink: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
      products: [
        {
          id: 4,
          name: "YouTube Premium - 6 tháng",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 69000,
          originalPrice: 149000,
          discount: 54,
          inStock: true,
        },
        {
          id: 5,
          name: "Spotify Premium - Cá nhân",
          image: "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg",
          salePrice: 99000,
          originalPrice: 149000,
          discount: 33,
          inStock: false,
        },
      ],
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {mockData.map((section) => (
        <CategorySection
          key={section.title}
          title={section.title}
          description={section.description}
          products={section.products}
          viewAllLink={section.viewAllLink}
        />
      ))}
    </div>
  );
};

export default ProductList;
