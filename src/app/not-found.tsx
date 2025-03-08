"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen ">
        <h1 className="text-btn-primary font-bold text-4xl">Not Found</h1>
        <p className="text-gray5 text-center pt-4 text-sm">
          페이지의 주소가 잘못 입력되었거나,
          <br /> 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Image
          src="/images/BaroFarmIcon.png"
          width={280}
          height={280}
          className="w-[280px]"
          alt="not-found image"
        />
        <button
          className="text-white text-sm bg-btn-primary px-5 py-2 rounded-md"
          onClick={() => router.push(`/`)}
        >
          메인으로
        </button>
      </div>
    </>
  );
}
