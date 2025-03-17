"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "store/userStore";

export default function LoginPage() {
  const router = useRouter();
  // 로그인 정보 저장
  const [rememberMe, setRememberMe] = useState(false);
  // 환경변수에서 시크릿 키 가져오기
  const SECRET_PW_KEY = process.env.AUTH_SECRET;

  // Zustand store에서 user 상태를 가져옴
  const { user } = useUserStore();
  console.log(user);
  // 로그인된 사용자가 /login 페이지에 접근하는 것을 방지
  // - user가 null인 경우: 로그인되지 않은 상태 => 로그인 페이지 유지
  // - user가 객체인 경우: 이미 로그인된 상태 => 메인 페이지로
  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues, // 현재 폼에 입력된 값들을 가져오는 함수
    setValue, // 폼 입력 필드에 값을 직접 설정하는 함수
    reset, // 폼의 초기값을 설정하거나 입력 필드의 값을 초기화하는 함수
  } = useForm({ mode: "onBlur" });

  // 로그인 실행시
  const onSubmit = async (formData) => {
    console.log("로그인 시도:", {
      email: formData.email,
      password: formData.password,
      rememberMe: rememberMe.toString(),
    });
    // NextAuth signIn 함수 호출
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // 에러 처리를 위해 리다이렉트는 직접 처리
      rememberMe: rememberMe.toString(), // credentials 객체는 모든 값을 문자열로 처리.
    });

    console.log("로그인 결과:", result);

    if (result?.error) {
      console.error("로그인 에러:", result.error);
    } else {
      router.push("/");
    }
  };

  const handleKakaoLogin = () => {
    // SDK가 초기화되지 않은 경우에만 초기화 진행
    // window.Kakao를 사용하는 이유
    // - React 컴포넌트(.jsx) 파일은 독립적인 공간을 가지고 있어서
    // - index.html에서 추가한 카카오 SDK를 바로 찾을 수 없음
    // - window(브라우저 전역 객체)를 통해 카카오 SDK에 접근해야 함
    if (!window.Kakao.isInitialized()) {
      // VITE_KAKAO_JS_KEY: 카카오 Developer에서 발급받은 JavaScript 키
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
      console.log("카카오 초기화 여부: ", window.Kakao.isInitialized());
    }

    window.Kakao.Auth.authorize({
      // window.location.origin: 현재 웹사이트의 도메인 주소를 가져옴 => 환경에 따라 자동으로 적절한 도메인이 적용됨
      redirectUri: `${window.location.origin}/users/login/kakao`,
      // scope는 사용자가 로그인할 때 동의해야 하는 권한을 지정하는 데 사용됩니다.
      // 이를 통해 카카오 계정으로부터 어떤 정보를 가져올지를 결정할 수 있습니다.
    });
    // console.log("리다이렉트 URI: ", `${window.location.origin}/users/login/kakao`);
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
          <button
            type="button"
            className="w-full h-[3.25rem] text-xl rounded-full bg-yellow1 font-medium flex items-center justify-center gap-1"
            onClick={handleKakaoLogin}
          >
            {/* 이미지가 장식 목적이고 옆의 텍스트가 이미 충분한 의미를 전달하고 있기 때문에 alt = "" 지정*/}
            <Image
              width={32}
              height={32}
              src="/images/login/kakaoLogo.png"
              alt=""
            />
            <span>카카오로 로그인하기</span>
          </button>
        </div>

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
