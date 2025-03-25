"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signOut } from "server-action";
import { useUserStore } from "store/userStore";

export default function MyPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const url = "https://11.fesp.shop";

  // zustand store에서 유저 상태 가져옴
  // 유저가 로그인 상태인지 확인하는 용도
  const user = useUserStore((store) => store.user);

  // 로그아웃 버튼 클릭시 실행될 함수
  const onHandleLogout = async () => {
    const result = await signOut(); // 쿠키 데이터 삭제
    queryClient.clear(); // 로그아웃 시 캐시 삭제
    if (result.success) {
      toast.success("로그아웃 되었습니다.");
      router.push("/users/login"); // 로그인 페이지로 리다이렉트
    }
  };

  // 로그인 버튼 클릭시 실행될 함수
  const onHandleLogin = () => {
    router.push("/users/login"); // 로그인 페이지로 이동
  };

  return (
    <>
      <div className="pt-[18px] px-5 mb-[70px]">
        <div className="h-auto pb-4">
          <div className="flex flex-row items-center">
            {user && (
              <>
                <Image
                  width={50}
                  height={50}
                  src={
                    user.image
                      ? user.image.includes("http://") ||
                        user.image.includes("https://")
                        ? user.image
                        : url + user.image
                      : "/images/profile/ProfileImage_Sample.jpg"
                  }
                  className="mr-5 rounded-full object-cover"
                  loading="lazy"
                  alt="profile image"
                />
                <div>
                  <p className="text-gray5/50 text-[12px] leading-[14px]">
                    {user.type == "seller" ? "판매회원" : "구매회원"}
                  </p>
                  <h2 className="text-[16px] leading-[18px] mt-[4px]">
                    {user.name}님! 어서오세요
                  </h2>
                </div>
                <button
                  onClick={onHandleLogout}
                  className="flex ml-auto h-fit items-center text-[14px]"
                >
                  로그아웃
                  <Image
                    width={16}
                    height={16}
                    src="/icons/icon_forward.svg"
                    className="ml-2"
                    alt="profileDetail icon"
                  />
                </button>
              </>
            )}
            {!user && (
              <>
                <Image
                  width={50}
                  height={50}
                  alt="profile image"
                  src={"/images/profile/ProfileImage_Sample.jpg"}
                  className="mr-5 rounded-full"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-[16px] leading-[18px] mt-[4px]">
                    게스트님! 어서오세요
                  </h2>
                </div>
                <button
                  onClick={onHandleLogin}
                  className="flex ml-auto h-fit items-center text-[14px]"
                >
                  로그인하기
                  <Image
                    width={16}
                    height={16}
                    src="/icons/icon_forward.svg"
                    className="ml-2"
                    alt="profileDetail icon"
                  />
                </button>
              </>
            )}
          </div>
          {user && (
            <div className="flex border-t-[1px] border-gray2 h-[58px] mt-[16px]">
              <Link
                href="/users/purchase"
                className="flex justify-center items-center flex-1 text-center h-[50px] border-r-[1px] border-gray2"
              >
                구매 내역
              </Link>
              {user.type === "seller" && (
                <Link
                  href="/users/sale"
                  className="flex justify-center items-center flex-1 text-center h-[50px] border-r-[1px] border-gray2"
                >
                  판매 내역
                </Link>
              )}
              <Link
                href="/users/myboard"
                className="flex justify-center items-center flex-1 text-center h-[50px]"
              >
                작성한 글{" "}
                <span className="text-btn-primary ml-1">{user.posts}건</span>
              </Link>
            </div>
          )}
        </div>
        <div className="h-[7px] bg-gray1 mx-[-20px]"></div>
        <div className="h-[152px] pt-[18px]">
          <h2 className="text-base leading-[19px]">구매 정보</h2>
          <Link
            href="/users/recent"
            className="flex items-center text-[14px] mt-[27px]"
          >
            최근 본 상품
            <Image
              width={16}
              height={16}
              src="/icons/icon_forward.svg"
              className=" ml-auto"
              alt="recentProduct icon"
            />
          </Link>
          <Link
            href="/users/bookmarks"
            className="flex items-center text-[14px] mt-[24px]"
          >
            찜한 상품
            <Image
              width={16}
              height={16}
              src="/icons/icon_forward.svg"
              className="ml-auto"
              alt="likedProduct icon"
            />
          </Link>
        </div>
        {/* 해당 영역은 로그아웃 상태일 시 사용을 필요로 하지 않음 */}
        {user && user.type === "seller" && (
          <>
            <div className="h-[7px] bg-gray1 mx-[-20px]"></div>
            <div className="h-[109px] pt-[18px] ">
              <h2 className="text-base leading-[19px]">판매 정보</h2>
              <Link
                href="/product/new"
                className="flex items-center text-[14px] mt-[27px] mb-[24px]"
              >
                상품 등록
                <Image
                  width={16}
                  height={16}
                  src="/icons/icon_forward.svg"
                  className="ml-auto"
                  alt="addProduct icon"
                />
              </Link>
            </div>
          </>
        )}
        {user && (
          <>
            <div className="h-[7px] bg-gray1 mx-[-20px]"></div>
            <div className="h-[109px] pt-[18px] ">
              <h2 className="text-base leading-[19px]">계정 관리</h2>
              <Link
                href="/users/profile"
                className="flex items-center text-[14px] mt-[27px] mb-[24px]"
                // state={{ id: data._id }}
              >
                내 정보 보기
                <Image
                  width={16}
                  height={16}
                  src="/icons/icon_forward.svg"
                  className="ml-auto"
                  alt="addProduct icon"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
