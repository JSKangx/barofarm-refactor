"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import HeaderIcon from "components/_/HeaderIcon";
import { useCategory } from "hook/useCategory";

interface HeaderConfig {
  leftChild?: React.ReactNode;
  title?: React.ReactNode | string;
  rightChild?: React.ReactNode;
}

export default function DynamicHeader() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const router = useRouter(); // 경로 이동하기 위한 훅 사용
  const { _id } = useParams(); // 동적 세그먼트 추출
  const categoryTitle = useCategory(_id);

  // 경로별로 헤더 구성 설정
  const getHeaderConfig = (): HeaderConfig => {
    // 헤더 구성 (디폴트)
    let headerConfig: HeaderConfig = {
      // 기본적으로는 back 버튼이 들어감
      leftChild: <HeaderIcon name="back" onClick={() => router.back()} />,
      title: "",
    };

    // 홈페이지
    if (pathname === "/") {
      headerConfig = {
        leftChild: (
          <Image
            src="/images/BaroFarmLogo_long.png"
            width={200}
            height={0}
            className="absolute top-1/2 -translate-y-1/2 h-auto"
            alt="BaroFarm Logo"
          />
        ),
        rightChild: (
          <>
            <HeaderIcon name="search" onClick={() => router.push("/search")} />
            <HeaderIcon
              name="cart_empty"
              onClick={() => router.push("/cart")}
            />
          </>
        ),
      };
    }
    // 상품 상세 페이지
    else if (pathname.startsWith("/product")) {
      headerConfig = {
        ...headerConfig,
        title: categoryTitle,
        rightChild: (
          <>
            <HeaderIcon name="home_empty" onClick={() => router.push("/")} />
            <HeaderIcon
              name="cart_empty"
              onClick={() => router.push("/cart")}
            />
          </>
        ),
      };
    }
    // 마이 페이지
    else if (pathname === "/users/mypage") {
      headerConfig = {
        ...headerConfig,
        title: "마이페이지",
        rightChild: (
          <>
            <HeaderIcon name="search" onClick={() => router.push("/search")} />
          </>
        ),
      };
    }
    // 게시판
    else if (pathname === "/board") {
      headerConfig = {
        ...headerConfig,
        title: "바로파밍",
        rightChild: (
          <>
            <HeaderIcon name="search" onClick={() => router.push("/search")} />
            <HeaderIcon
              name="cart_empty"
              onClick={() => router.push("/cart")}
            />
          </>
        ),
      };
    }
    // 검색 페이지
    else if (pathname === "/search") {
      headerConfig = {
        ...headerConfig,
        title: "검색",
      };
    }

    return headerConfig;
  };

  const { leftChild, title, rightChild } = getHeaderConfig();

  return (
    <header className="flex bg-white max-w-[390px] mx-auto h-[70px] px-5 items-center justify-between border-b border-gray3 fixed top-0 left-0 right-0 z-10 *:flex">
      <div className="shrink-0 w-[25%]">{leftChild}</div>
      <div className="justify-center grow w-[50%] text-[18px] font-semibold *:h-[70px]">
        {title}
      </div>
      <div className="shrink-0 w-[25%] gap-[10px] justify-end *:flex relative">
        {rightChild}
      </div>
    </header>
  );
}
