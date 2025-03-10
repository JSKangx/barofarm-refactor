// RequestInit : fetch API의 기본 옵션 타입
// HeadersInit : 헤더 관련 타입
// RequestInit에서 headers 속성만 제외한 타입 + headers 속성을 추가하여 커스텀 타입 정의
type FetchApiOptions = RequestInit;

// 공통 fetch 유틸리티
// fetch api처럼 매개변수로 url과 options 객체를 받는다.
export async function fetchApi(
  endpoint: string,
  options: FetchApiOptions = {}
) {
  const baseUrl = "https://11.fesp.shop";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "client-id": "final04",
    ...(options.headers || {}),
  };

  // fetchApi 함수를 호출하는 곳에서 전체 url을 전달할 때랑 endpoint만 전달할 때 둘 다 적용되게 하기
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  // 호출할 때는 바로 data를 받을 수 있음
  return response.json();
}
