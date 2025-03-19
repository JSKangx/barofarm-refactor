"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserStore } from "store/userStore";
import { ErrorResponse, UserResponseNoToken } from "type/user";

interface LoginFormProps {
  redirectPath?: string;
  error?: string;
}

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm({
  redirectPath,
  error: initialError,
}: LoginFormProps) {
  const router = useRouter(); // 라우트
  const { setUser } = useUserStore();
  // 로그인 정보 저장
  const [rememberMe, setRememberMe] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues, // 현재 폼에 입력된 값들을 가져오는 함수
    setValue, // 폼 입력 필드에 값을 직접 설정하는 함수
    reset, // 폼의 초기값을 설정하거나 입력 필드의 값을 초기화하는 함수
  } = useForm<FormData>({ mode: "onBlur" });

  // 일반 로그인 실행
  const loginMutation = useMutation<
    UserResponseNoToken,
    ErrorResponse,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      // 라우트 핸들러로 요청 보냄
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe,
        }),
      });

      const data: UserResponseNoToken = await res.json();
      // 응답이 성공적이지 않은 경우 명시적으로 에러 객체를 구성하여 던짐
      if (data.ok === 0) {
        const errorResponse: ErrorResponse = {
          ok: 0,
          message: data.message || "로그인에 실패했습니다.",
          errors: data.errors,
        };
        console.log("에러 발생:", errorResponse); // 디버깅용 로그 추가
        throw errorResponse;
      }

      return data;
    },
    onSuccess: (res) => {
      // 로그인 성공시 유저 정보를 스토어에 저장
      const user = res.item;
      toast.success(user.name + "님, 로그인 되었습니다.");
      setUser({
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        image: user.image,
        address: user.address,
        phone: user.phone,
      });

      // 로그인 성공 후 리다이렉트
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    },
    onError: (err: ErrorResponse) => {
      // console.log("로그인 실패 - 전체 에러 객체:", err); // 전체 에러 객체 로깅
      // console.log("에러 타입:", typeof err); // 에러 타입 확인
      // console.log("err.errors 존재 여부:", Boolean(err.errors)); // errors 속성 존재 여부 확인
      // console.log("err.errors:", err.errors);
      // console.log("err.message:", err.message);
      if (err.errors) {
        err.errors.forEach((e) => setError(e.path, { message: e.msg }));
      } else {
        toast.error(err.message || "잠시 후 다시 요청하세요.");
      }
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((formData) => loginMutation.mutate(formData))}
      >
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
          <p className="text-red1 text-xs -mt-7 mb-4">{errors.email.message}</p>
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
    </>
  );
}
