import LoginForm from "components/_/auth/LoginForm";
import Spinner from "components/Spinner";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  // 쿠키에서 토큰을 가져와 이미 로그인되어 있는지 확인
  const accessToken = cookies().get("accessToken")?.value;
  // 로그인 되어 있으면 이전 페이지 혹은 홈페이지로 리다이렉트
  if (accessToken) {
    redirect(searchParams.redirect || "/");
  }

  return (
    <>
      <div className="p-5">
        {/* 로고 영역 */}
        <div className="flex justify-center items-center m-auto w-[300px] h-[300px]">
          <Image
            width={300}
            height={300}
            className="block"
            src="/images/BaroFarmLogo.png"
            alt="바로팜 로고 이미지"
          />
        </div>

        <Suspense fallback={<Spinner />}>
          <LoginForm redirectPath={searchParams.redirect} />
        </Suspense>

        <div className="mb-5 w-full h-[3.25rem] m-auto">
          <p className="flex justify-center text-sm gap-1.5 font-medium">
            바로팜이 처음이신가요?
            <Link
              href="/users/signup"
              className="text-btn-primary font-medium hover:font-bold"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
