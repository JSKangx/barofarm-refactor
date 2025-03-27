"use client";

import PostItem from "components/_/board/PostItem";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { useUserStore } from "store/userStore";
import { PostType } from "type/board";

interface BoardClientProps {
  posts: PostType[];
}

export default function BoardClient({ posts }: BoardClientProps) {
  const { user } = useUserStore(); // 유저 정보 가져오기
  const router = useRouter();
  // Next.js에서는 읽기 전용이라 직접 상태 변경 불가
  const searchParams = useSearchParams();

  // 새로운 searchParams 객체를 생성하고 URL을 업데이트하는 함수
  const updateSearchParams = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // formData 선언
    const formData = new FormData(e.currentTarget);
    // keyword input에 접근
    const value = (formData.get("keyword") as string)?.trim();
    const params = new URLSearchParams(searchParams.toString());
    // 검색어가 있으면 params 객체 업데이트
    if (value) {
      params.set("keyword", value);
    } else {
      params.delete("keyword");
    }

    // URL navigation
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative mx-5">
      <form className="pt-2" onSubmit={(e) => updateSearchParams(e)}>
        <label htmlFor="search" className="text-sm font-semibold block mb-2">
          게시판 검색
        </label>
        <div className="flex items-center gap-1 w-full rounded-md p-1 border border-gray3 focus-within:border-btn-primary">
          <button type="submit" aria-label="검색하기">
            <img src="/icons/icon_search.svg" alt="" />
          </button>
          <input
            className="flex-grow border-none outline-none
              [&::-webkit-search-cancel-button]:appearance-none
              [&::-webkit-search-cancel-button]:bg-[url('/icons/icon_x_thin.svg')]
              [&::-webkit-search-cancel-button]:bg-center
              [&::-webkit-search-cancel-button]:h-4
              [&::-webkit-search-cancel-button]:w-4"
            type="search"
            placeholder="키워드를 입력해주세요"
            id="search"
            name="keyword"
            maxLength={20}
          />
        </div>
      </form>
      <div className="flex my-2 items-center bg-btn-primary rounded-md gap-3 p-3">
        <Image
          width={80}
          height={0}
          src="/images/BaroFarmIcon.png"
          alt="바로팜 로고"
          className="h-auto object-cover"
        />

        <p className="text-white text-sm break-keep">
          바로파밍은
          <br />
          모든 회원이 함께하는<span className="text-orange-400">
            {" "}
            소통
          </span>{" "}
          공간입니다.
          <br /> 바로팜에서 구매한 상품으로 만든 요리를 자랑하고 나만의 레시피를
          나누어 보세요!
        </p>
      </div>
      {posts?.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
}
