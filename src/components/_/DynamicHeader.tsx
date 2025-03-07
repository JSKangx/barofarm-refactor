"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import HeaderIcon from "components/_/HeaderIcon";

interface HeaderConfig {
  leftChild?: React.ReactNode;
  title?: React.ReactNode | string;
  rightChild?: React.ReactNode;
}

export default function DynamicHeader() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const router = useRouter(); // 경로 이동하기 위한 훅 사용

  // 경로별로 헤더 구성 설정
  const getHeaderConfig = (): HeaderConfig => {
    if (pathname === "/") {
      return {
        leftChild: (
          <Image
            src="/images/BaroFarmLogo_long.png"
            width={140}
            height={40}
            className="absolute top-1/2 -translate-y-1/2 h-[40px] w-auto"
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
