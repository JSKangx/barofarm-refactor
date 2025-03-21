import { cookies } from "next/headers";

// RequestInit : fetch API의 기본 옵션 타입
type FetchApiOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
  delay?: number; // delay 옵션 추가
};

// baseURL
const baseUrl = process.env.NEXT_PUBLIC_API_HOST;

// delay 유틸리티 함수
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 리프레시 토큰으로 액세스 토큰 갱신하는 함수
async function refreshAccessToken() {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
    }
  } catch (err) {
    console.error(err);
  }
}

// 공통 fetch 유틸리티
// fetch api처럼 매개변수로 url과 options 객체를 받는다.
export async function fetchApi(
  endpoint: string,
  options: FetchApiOptions = {}
) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "client-id": "final04",
    ...(options.headers || {}),
  };

  // delay 옵션이 있으면 지정된 시간만큼 지연
  if (options.delay && options.delay > 0) {
    await sleep(options.delay);
  }

  // fetchApi 함수를 호출하는 곳에서 전체 url을 전달할 때랑 endpoint만 전달할 때 둘 다 적용되게 하기
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  // Next.js data fetching 관련 옵션 추출
  const { next, cache, ...restOptions } = options;

  // Next.js 옵션을 fetch에 전달
  const response = await fetch(url, {
    ...restOptions,
    next,
    cache,
    headers, // 커스텀 headers를 명시적으로 전달해야 기본 headers와 병합됨.
  });

  // 호출할 때는 바로 data를 받을 수 있음
  return response.json();
}
