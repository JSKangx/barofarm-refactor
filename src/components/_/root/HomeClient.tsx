"use client";

import Carousel from "components/_/market/Carousel";
import Product from "components/_/market/Product";
import ProductBig from "components/_/market/ProductBig";
import { categories } from "constants/market";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "store/userStore";
import { PostType } from "type/board";
import { ProductType } from "type/product";

interface Props {
  saleProducts: ProductType[];
  bestProducts: ProductType[];
  newProducts: ProductType[];
  onMonthProducts: ProductType[];
  posts: PostType[];
}

export default function HomeClient({
  saleProducts,
  bestProducts,
  newProducts,
  onMonthProducts,
  posts,
}: Props) {
  // 카테고리 아이콘 렌더링
  const categoryIcons = categories.map((item) => (
    <Link
      href={item.url}
      key={item.url}
      className="relative flex flex-col items-center"
    >
      <div className="relative w-full aspect-square mb-1">
        <Image
          fill
          sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
          src={item.image}
          alt={`${item.title} 카테고리`}
          className="object-contain rounded-lg"
        />
      </div>
      <span>{item.title}</span>
    </Link>
  ));

  // 게시글 이미지 렌더링
  const storyImages = (
    <div className={`grid grid-cols-3 px-5 gap-1`}>
      {/* 최대 9개까지만 필터링 */}
      {posts
        ?.filter((_, index) => index < 9)
        .map((item) => (
          <Link
            href={`/board/${item._id}`}
            key={item._id}
            className="aspect-square w-full relative"
          >
            <Image
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 30vw, 25vw"
              src={`https://11.fesp.shop${item.image}`}
              alt={item.content}
              className="object-cover"
            />
          </Link>
        ))}
    </div>
  );

  return (
    <div>
      <Carousel height={225} data={saleProducts} />
      <section className="px-5 mb-4">
        <h2 className="text-xl mb-3">
          관심있는 <span className="font-bold">카테고리</span> 선택하기
        </h2>
        <div className="category-div grid grid-cols-4 gap-y-[6px] gap-x-[14px] text-[14px]">
          {categoryIcons}
        </div>
      </section>
      <section className="px-5 mb-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl">
            지금 최고 <span className="font-bold">인기 상품! 🔥</span>
          </h2>
          <Link
            href={"/search/best"}
            className="text-xs flex gap-1 items-start cursor-pointer"
          >
            더보기
            <Image
              width={16}
              height={16}
              src="/icons/icon_move.svg"
              alt="더보기 버튼"
              className="size-4"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-between gap-5">
          {bestProducts.map((product) => (
            <Product key={product._id} {...product} />
          ))}
        </div>
      </section>
      <section className="px-5 mb-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl">
            따끈따끈한 <span className="font-bold">신상품! ⏰</span>
          </h2>
          <Link
            href={"/search/new"}
            className="text-xs flex gap-1 items-start cursor-pointer"
          >
            더보기
            <Image
              width={16}
              height={16}
              src="/icons/icon_move.svg"
              alt="더보기 버튼"
              className="size-4"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-between gap-5">
          {newProducts.map((product) => (
            <Product key={product._id} {...product} />
          ))}
        </div>
      </section>
      <section className="px-5 mb-4">
        <div className="flex justify-between">
          <h2 className="text-xl">
            이 맛이야! <span className="font-bold">제철 음식 🍂</span>
          </h2>
          <Link
            href={"/search/seasonal"}
            className="text-xs flex gap-1 items-start cursor-pointer"
          >
            더보기
            <Image
              width={16}
              height={16}
              src="/icons/icon_move.svg"
              alt="더보기 버튼"
              className="size-4"
            />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-3">
          {onMonthProducts.map((product) => (
            <ProductBig key={product._id} {...product} />
          ))}
        </div>
      </section>
      <section className="mb-4">
        <div className="flex justify-between px-5 mb-4">
          <h2 className="text-xl">
            나만의 <span className="font-bold">요리 스토리 🥘</span>
          </h2>
          <div className="flex gap-1 items-start relative *:relative *:top-1">
            <Link href="/board" className="text-xs">
              커뮤니티 가기
            </Link>
            <button>
              <Image
                width={16}
                height={16}
                src="/icons/icon_move.svg"
                alt="더보기 버튼"
                className="size-4"
              />
            </button>
          </div>
        </div>
        {storyImages}
      </section>
      <section className="flex flex-col gap-1 px-5 bg-gray1 text-black text-sm py-5 text-center">
        <p className="font-semibold">(주) 바로팜 사업자 정보</p>
        <p>
          (주)바로팜 | 대표자 : 바로팜 <br />
          사업자 등록번호 : 023-25-59672 <br />
          주소 : 서울 강남구 옆집의 옆집 234로 무천타워 2층 <br />
          대표번호 : 1588-1028 <br />
          메일 : baroFarm@baroFarm.co.kr
        </p>
        <p className="font-semibold">고객센터 1800-1800</p>
        <p className="mb-[58px]">
          누구보다 빠르게 남들과는 다르게 상담해 드립니다.
        </p>
        <p>이용약관 | 개인정보처리방침 | 게시글 수집 및 이용 안내</p>
      </section>
    </div>
  );
}
