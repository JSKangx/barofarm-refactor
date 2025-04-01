"use client";

import Products from "components/market/Products";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ProductType } from "type/product";

interface Props {
  searchKeyword: string;
  sortType: string;
  data: ProductType[];
}

export default function ResultClient({ searchKeyword, sortType, data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // /search/results(URL)로 직접 접근했을 때 키워드가 없으면 검색 페이지로 리다이렉트
    if (!searchKeyword) {
      window.location.href = "/search";
    }
  }, [searchKeyword]);

  // sortType 변경될 때 실행될 함수
  const sortChangeHandler = (sortType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortType);

    // URL navigation
    router.push(`/search/results?${params.toString()}`);
  };

  return (
    <>
      <div>
        <div className="p-5 flex items-center font-semibold">
          <h2>총 {data?.length}개</h2>
          <div className="ml-auto text-sm">
            <select
              className="text-center bg-gray2 rounded-lg py-1 ps-3 pe-6 appearance-none focus:outline-none cursor-pointer
      bg-[url('/icons/icon_dropdown.svg')] bg-no-repeat bg-[center_right_0.5rem]"
              aria-label="정렬 기준 선택"
              name="sort"
              value={sortType} // 현재 URL의 sort 값을 반영
              onChange={(e) => sortChangeHandler(e.target.value)} // 정렬 기준 변경 시 handleSortChange 호출
            >
              <option value='{"createdAt":-1}'>최신순</option>
              <option value='{"extra.saledPrice":-1}'>높은 가격순</option>
              <option value='{"extra.saledPrice":1}'>낮은 가격순</option>
              {/* extra.rating: 임의로 설정한 평점, rating: 리뷰의 평점을 기반으로 서버에서 자동 계산된 값 */}
              <option value='{"rating":-1}'>평점순</option>
              <option value='{"replies":-1}'>후기 개수순</option>
              <option value='{"buyQuantity":-1}'>판매 수량순</option>
            </select>
          </div>
        </div>
        {/* 검색 결과 없을 때와 있을 때의 조건부 렌더링 */}
        {data?.length === 0 ? (
          <div className="p-5 text-sm text-center font-medium mt-3">
            <Image
              width={48}
              height={48}
              className="block m-auto mb-2"
              src="/icons/icon_sad.svg"
              alt="검색 결과 없음 아이콘"
            />
            <p>입력하신 검색어의 결과를 찾을 수 없습니다.</p>
            <p>다른 검색어로 시도하시거나 맞춤법을 확인해주세요.</p>
          </div>
        ) : (
          <Products productsData={data} />
        )}
      </div>
    </>
  );
}
