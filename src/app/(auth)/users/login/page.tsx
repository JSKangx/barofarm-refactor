"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "store/userStore";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  // 로그인 정보 저장
  const [rememberMe, setRememberMe] = useState(false);

  // Zustand store에서 user 상태를 가져옴
  const { user } = useUserStore();

  // 로그인된 사용자가 /login 페이지에 접근하는 것을 방지
  // - user가 null인 경우: 로그인되지 않은 상태 => 로그인 페이지 유지
  // - user가 객체인 경우: 이미 로그인된 상태 => 메인 페이지로
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // 폼의 초기값을 설정하거나 입력 필드의 값을 초기화하는 함수
  } = useForm<LoginFormData>({ mode: "onBlur" });

  // 로그인 실행시
  const onSubmit = async (formData: LoginFormData) => {
    // NextAuth signIn 함수 호출
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // 에러 처리를 위해 리다이렉트는 직접 처리
      rememberMe: rememberMe.toString(), // credentials 객체는 모든 값을 문자열로 처리.
    });

    if (result?.error) {
      console.error("로그인 에러:", result.error);
    } else {
      router.push("/");
    }
  };

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

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-b-2 border-gray2 mb-8 focus-within:border-b-btn-primary">
            <input
              type="email"
              placeholder="이메일"
              className="placeholder:text-gray4 w-full outline-none"
              {...register("email", { required: "이메일은 필수입니다." })}
              // 강사님 배포 테스트 이메일
              defaultValue={"barofarm@market.com"}
            />
          </div>
          {errors.email && (
            <p className="text-red1 text-xs -mt-7 mb-4">
              {errors.email.message}
            </p>
          )}
          <div className="border-b-2  border-gray2 mb-4 focus-within:border-b-btn-primary">
            <input
              type="password"
              placeholder="비밀번호"
              className="placeholder:text-gray4 w-full outline-none"
              {...register("password", { required: "비밀번호는 필수입니다." })}
              // 강사님 배포 테스트 패스워드
              defaultValue={11111111}
            />
          </div>
          {errors.password && (
            <p className="text-red1 text-xs -mt-3 mb-4">
              {errors.password.message}
            </p>
          )}
          <label className="mb-8 flex items-center gap-1 font-normal">
            <input
              className="w-5 h-5 mr-1 rounded-full appearance-none bg-gray2  bg-[url('/icons/icon_check_white.svg')] bg-center bg-no-repeat  checked:bg-btn-primary checked:bg-[url('/icons/icon_check_white.svg')] checked:bg-center checked:bg-no-repeat cursor-pointer "
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => {
                setRememberMe(e.target.checked);
                // 체크 해제 시
                if (!e.target.checked) {
                  reset({ email: "", password: "" }); // 폼 필드 초기화
                  localStorage.removeItem("userInfo"); // 로컬 스토리지 데이터 삭제
                }
              }}
            />
            <span className="text-sm cursor-pointer">로그인 정보 저장</span>
          </label>
          <div className="mb-5 w-full h-[3.25rem] m-auto">
            <button
              type="submit"
              className="w-full h-[3.25rem] text-center text-xl rounded-full bg-btn-primary font-medium text-white"
            >
              로그인
            </button>
          </div>
        </form>

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
