import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Carousel = ({ images = [], autoSlide = false, autoSlideInterval = 3000 }) => {
  if (!images || images.length === 0) return null;

  const swiperModules = [Navigation, Pagination];
  if (autoSlide) swiperModules.push(Autoplay);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-xl group">
      <Swiper
        modules={swiperModules}
        loop={images.length > 1}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={
          autoSlide && images.length > 1
            ? { delay: autoSlideInterval, disableOnInteraction: false }
            : false
        }
        className="w-full h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src="http://103.238.235.227//uploads/a7c39abd-ca21-41d9-a300-c4b13d016e8d.png"
              alt={`slide-${index}`}
              className="w-full h-64 sm:h-80 md:h-[420px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            className="custom-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 z-10 transition hidden group-hover:block"
          >
            ‹
          </button>
          <button
            className="custom-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 z-10 transition hidden group-hover:block"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
