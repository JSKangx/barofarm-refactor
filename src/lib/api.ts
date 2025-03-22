"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// RequestInit : fetch API의 기본 옵션 타입
export type FetchApiOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
  delay?: number; // delay 옵션 추가
};

// baseURL
const baseUrl = process.env.API_HOST;

// delay 유틸리티 함수
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 리프레시 토큰으로 액세스 토큰 갱신하는 함수
async function refreshAccessToken() {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
      return false;
    }

    // accessToken 갱신 요청
    interface AuthRes extends Omit<Response, "ok"> {
      ok: number | boolean;
      accessToken?: string;
      message?: string;
      errorName?: "EmptyAuthorization | TokenExpiredError | JsonWebTokenError";
    }
    const response: AuthRes = await fetch(`${baseUrl}/auth/refresh`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "client-id": "final04",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    // 토큰 갱신 요청 실패시 false 반환
    if (!response.ok) return false;

    const res = await response.json();

    // 토큰 갱신 성공시 새로운 accessToken 저장
    if (res.accessToken) {
      cookies().set("accessToken", res.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return true;
    } else {
      const errors = {
        message: res.message,
        errorName: res.errorName,
      };
      throw new Error(JSON.stringify(errors));
    }
  } catch (err) {
    console.error("토큰 갱신 중 오류 발생", err);
    return false;
  }
}

// 공통 fetch 유틸리티
// fetch api처럼 매개변수로 url과 options 객체를 받는다.
export async function fetchApi(
  endpoint: string,
  options: FetchApiOptions = {}
) {
  // 기본 헤더 설정
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "client-id": "final04",
    ...((options.headers as Record<string, string>) || {}),
  };

  // 액세스 토큰이 쿠키에 있으면 자동으로 헤더에 추가
  const accessToken = cookies().get("accessToken")?.value;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // delay 옵션이 있으면 지정된 시간만큼 지연
  if (options.delay && options.delay > 0) {
    await sleep(options.delay);
  }

  // fetchApi 함수를 호출하는 곳에서 전체 url을 전달할 때랑 endpoint만 전달할 때 둘 다 적용되게 하기
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  // Next.js data fetching 관련 옵션 추출
  const { next, cache, ...restOptions } = options;

  try {
    // 첫번째 요청 시도
    let response = await fetch(url, {
      ...restOptions,
      next,
      cache,
      headers, // 커스텀 headers를 명시적으로 전달해야 기본 headers와 병합됨.
    });

    // 401 에러가 발생하면 리프레시 시도
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // 새로 발급받은 토큰으로 헤더 업데이트
        const newAccessToken = cookies().get("accessToken")?.value;
        headers.Authorization = `Bearer ${newAccessToken}`;

        // 새 토큰으로 다시 요청
        response = await fetch(url, {
          ...restOptions,
          next,
          cache,
          headers, // 커스텀 headers를 명시적으로 전달해야 기본 headers와 병합됨.
        });
      } else {
        // 클라이언트에게 status를 401로 반환해서 리다이렉트 시키게 함
        return {
          ok: 0,
          status: 401,
        };
      }
    }

    // 결과 반환
    return response.json();
  } catch (error) {
    console.error("API 요청 중 오류 발생", error);
    return {
      error: "요청 처리 중 오류가 발생했습니다.",
      status: 500,
    };
  }
}
