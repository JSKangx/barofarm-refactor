import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");

  // 새 요청 헤더 생성
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  // 수정된 헤더로 요청 전달
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
