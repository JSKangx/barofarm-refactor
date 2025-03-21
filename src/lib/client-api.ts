"use client";

import { fetchApi, FetchApiOptions } from "lib/api";
import { redirect } from "next/navigation";

// 클라이언트에서 사용할 API 래퍼
export async function clientFetchApi(
  endpoint: string,
  options: FetchApiOptions = {}
) {
  const response: Response = await fetchApi(endpoint, options);

  // 401 응답 처리 (로그인 페이지로 리디렉션)
  if (response.status === 401) {
    redirect("/users/login");
  }

  return response;
}
