"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ProductType } from "type/product";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CarouselProps {
  width?: number;
  height: number;
  data: ProductType[];
}

export default function Carousel({ width = 390, height, data }: CarouselProps) {
  const router = useRouter();

  const slides = data.map((item, index) => (
    <SwiperSlide key={item?._id}>
      <Image
        width={width}
        height={height}
        src={`https://11.fesp.shop${item?.mainImages[0]?.path}`}
        alt={`${index}번 이미지`}
        style={{
          height: `${height}px`,
          objectFit: "cover",
        }}
        onClick={() => router.push(`/product/${item._id}`)}
        className="cursor-pointer w-full"
      />
      {/* 상품 정보를 나타내는 자막 */}
      <div className="absolute flex bottom-7 left-3 bg-white/80 rounded-lg px-2 py-1 items-center gap-2">
        <span className="text-red1 font-semibold text-sm pr-1">
          {item?.extra.sale}%
        </span>
        <span className="text-xs line-clamp-1">
          {item?.name} ({item?.rating ? item?.rating : 0})
        </span>
      </div>
    </SwiperSlide>
  ));

  return (
    <section
      style={{ height: `${height}px` }}
      className="flex text-center mb-[10px] relative w-full"
    >
      <Swiper
        style={{ height: `${height}}px` }}
        spaceBetween={50}
        slidesPerView={1}
        modules={[Pagination, A11y, Autoplay]}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {slides}
      </Swiper>
    </section>
  );
}
