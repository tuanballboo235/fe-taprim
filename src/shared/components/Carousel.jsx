import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAssetUrl } from "@/shared/utils/apiEndpoint";

const Carousel = ({ images = [], autoSlide = false, autoSlideInterval = 3000 }) => {
  if (!images?.length) return null;

  const swiperModules = [Navigation, Pagination];
  if (autoSlide) swiperModules.push(Autoplay);

  return (
    <div className="group relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Swiper
        modules={swiperModules}
        loop={images.length > 1}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={
          autoSlide && images.length > 1
            ? { delay: autoSlideInterval, disableOnInteraction: false }
            : false
        }
        className="h-full w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={`${img}-${index}`}>
            <img
              src={getAssetUrl(img)}
              alt={`Slide ${index + 1}`}
              className="h-64 w-full object-cover sm:h-80 md:h-[420px]"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="custom-prev absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900 group-hover:flex"
            aria-label="Anh truoc"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="custom-next absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900 group-hover:flex"
            aria-label="Anh tiep theo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
