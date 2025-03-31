"use client";

import RecentKeywordItem from "components/_/search/RecentKeywordItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SearchPage() {
  const router = useRouter();
  // 최근 검색어 상태 관리
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  // Next.js에서는 컴포넌트가 마운트 된 후에 localStorage에 접근해야 함
  useEffect(() => {
    const storedKeywords = JSON.parse(
      localStorage.getItem("recentKeywords") || "[]"
    );
    setRecentKeywords(storedKeywords);
  }, []);

  // 검색어 저장하는 함수
  const saveKeyword = (newKeyword: string) => {
    // 이미 존재하는 검색어인지 확인(중복 방지)
    if (!recentKeywords.includes(newKeyword)) {
      // 새로운(최근) 검색어를 배열 앞에 추가
      const updatedKeywords = [newKeyword, ...recentKeywords];
      // 최대 개수 10개로 제한
      const limitedKeywords = limitKeywords(updatedKeywords);
      // localStorage 업데이트
      localStorage.setItem("recentKeywords", JSON.stringify(limitedKeywords));
      // state 업데이트
      setRecentKeywords(limitedKeywords);
    }
  };

  // 검색어 10개로 제한하는 함수
  const limitKeywords = (keywords: string[]) => {
    // 10개 초과시 가장 오래된 검색어 제거
    if (keywords.length > 10) {
      return keywords.slice(0, 10); // 배열이 10개 초과일 때: 앞에서부터 10개만 잘라서 반환
    }
    return keywords; // 배열이 10개 이하일 때: 전체 배열을 그대로 반환
  };

  // 검색어 개별 삭제하는 함수
  const removeKeyword = (keywordToRemove: string) => {
    // filter로 선택된 검색어만 제외하고 새 배열 생성
    const filteredKeywords: string[] = recentKeywords.filter(
      (keyword) => keyword !== keywordToRemove
    );
    // localStorage 업데이트
    localStorage.setItem("recentKeywords", JSON.stringify(filteredKeywords));
    // state 업데이트
    setRecentKeywords(filteredKeywords);
  };

  // 검색어 전체 삭제하는 함수
  const clearAllKeyword = () => {
    localStorage.removeItem("recentKeywords");
    setRecentKeywords([]);
  };

  // 검색어 제출 처리 함수
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // formData 선언
    const formData = new FormData(e.currentTarget);
    // keyword input에 접근
    const value = (formData.get("keyword") as string)?.trim();

    // 검색어가 없는 경우 경고 메시지 출력 후 종료
    if (!value) {
      toast.info("검색어를 입력해주세요.");
      return; // navigate 방지
    }

    // 검색어가 있는 경우 localStorage에 검색어 저장
    saveKeyword(value);
    // 검색어가 있는 경우 검색 결과 페이지로 이동
    router.push(`/search/results?keyword=${value}`);
  };

  return (
    <>
      <div className="p-5">
        {/* 검색창 */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="search" className="text-sm font-semibold block mb-2">
            찾으시는 상품이 있으신가요?
          </label>
          <div className="flex items-center gap-1 w-full rounded-md p-1 border border-gray3 focus-within:border-btn-primary">
            <button type="submit" aria-label="검색하기">
              <Image
                width={24}
                height={24}
                src="/icons/icon_search.svg"
                alt="검색 버튼"
              />
            </button>
            <input
              className="flex-grow border-none outline-none
                [&::-webkit-search-cancel-button]:appearance-none
                [&::-webkit-search-cancel-button]:bg-[url('/icons/icon_x_thin.svg')]
                [&::-webkit-search-cancel-button]:bg-center
                [&::-webkit-search-cancel-button]:h-4
                [&::-webkit-search-cancel-button]:w-4"
              type="search"
              placeholder="검색어를 입력해주세요"
              id="search"
              name="keyword"
              maxLength={20}
            />
          </div>
        </form>
        {/* 최근 검색어 */}
        <div className="flex items-center mt-2.5">
          <h5 className="flex-grow text-sm font-semibold">최근 검색어</h5>
          <button
            className="text-xs font-medium"
            type="button"
            onClick={clearAllKeyword}
          >
            전체 삭제
          </button>
        </div>

        <ul className="mt-2.5 flex items-center flex-wrap gap-2.5 text-sm">
          {recentKeywords.map((keyword) => (
            <RecentKeywordItem
              key={keyword}
              keyword={keyword}
              onRemove={removeKeyword}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
