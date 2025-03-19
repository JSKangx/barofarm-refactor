import { fetchApi } from "lib/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserResponseType } from "type/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // 백엔드 API에 로그인 요청
    const data: UserResponseType = await fetchApi("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    // 성공적으로 로그인 됐으면
    if (data.ok === 1) {
      // 토큰을 HTTP-only 쿠키에 저장
      const cookieStore = cookies();

      // _id 저장
      cookieStore.set("_id", String(data.item._id), {
        httpOnly: true,
        // 쿠키의 secure 속성을 개발환경과 프로덕션 환경에서 다르게 설정.
        // 프로덕션 환경 : true, 개발환경 : false
        // true는 HTTPS 연결에서만 쿠키가 전송되도록 함.
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // CSRF 방지를 위해 strict 대신 lax 사용 (리다이렉트 허용)
        // 쿠키가 유효한 경로 (도메인의 모든 경로에서 유효함)
        path: "/",
        // 로그인 유지면 15일, 아니면 1시간
        maxAge: rememberMe ? 60 * 60 * 24 * 15 : 60 * 60,
      });

      // 액세스 토큰 저장
      cookieStore.set("accessToken", data.item.token.accessToken, {
        httpOnly: true,
        // 쿠키의 secure 속성을 개발환경과 프로덕션 환경에서 다르게 설정.
        // 프로덕션 환경 : true, 개발환경 : false
        // true는 HTTPS 연결에서만 쿠키가 전송되도록 함.
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // CSRF 방지를 위해 strict 대신 lax 사용 (리다이렉트 허용)
        // 쿠키가 유효한 경로 (도메인의 모든 경로에서 유효함)
        path: "/",
        // 로그인 유지면 15일, 아니면 1시간
        maxAge: rememberMe ? 60 * 60 * 24 * 15 : 60 * 60,
      });

      // 리프레시 토큰
      cookieStore.set("refreshToken", data.item.token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30일
        path: "/",
      });

      // 민감하지 않은 사용자 정보만 클라이언트에 반환
      const { token, ...userInfo } = data.item;
      // eslint 만족시키기 위한 로깅
      console.log(token);
      return NextResponse.json({
        ok: 1,
        item: userInfo,
      });
    } else {
      const statusCode = data.errors ? 422 : 403;
      return NextResponse.json(
        {
          ok: 0,
          message: data.message,
          errors: data.errors,
        },
        {
          status: statusCode,
        }
      );
    }
  } catch (error) {
    console.error("로그인 오류", error);

    return NextResponse.json(
      {
        ok: 0,
        message:
          "요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.",
      },
      {
        status: 500,
      }
    );
  }
}
