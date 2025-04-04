import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 토큰으로 인증 확인
  const isAuthenticated = request.cookies.has("accessToken");

  // 보호할 경로 패턴
  const protectedPaths = [
    "/product/new",
    "/cart",
    "/payment",
    "/complete",
    "/users/profile",
    "/users/profile/edit",
    "/users/bookmarks",
    "/users/recent",
    "/users/sale",
    "/users/purchase",
    "/users/myboard",
    "/board/new",
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 로그인 안 된 사용자가 protectedPath에 접근하려고 하면
  if (
    (isProtectedPath && !isAuthenticated) ||
    request.nextUrl.pathname === "/users/login/kakao"
  ) {
    // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/users/login", request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    "/product/new",
    "/cart",
    "/payment",
    "/complete",
    "/users/login/kakao",
    "/users/profile",
    "/users/profile/edit",
    "/users/bookmarks",
    "/users/recent",
    "/users/sale",
    "/users/purchase",
    "/users/myboard",
    "/board/new",
  ],
};
