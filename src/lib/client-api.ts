"use client";

import { fetchApi, FetchApiOptions } from "lib/api";
import { toast } from "react-toastify";

// 클라이언트에서 사용할 API 래퍼
export async function clientFetchApi(
  endpoint: string,
  options: FetchApiOptions = {}
) {
  try {
    // fetchApi 함수를 호출
    const response = await fetchApi(endpoint, options);

    // 서버에서 401 응답을 보냈다면
    if (response.status === 401) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      toast.error("로그인이 필요합니다.");
      setTimeout(() => {
        window.location.href = `/users/login?redirect=${returnUrl}&error=Unauthorized`;
      }, 1000);
    }

    return response;
  } catch (error) {
    console.error(error);
    return { ok: 0, error: "요청 처리 중 오류가 발생했습니다." };
  }
}
