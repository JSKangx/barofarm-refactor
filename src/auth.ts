import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { MongoClient } from "mongodb";
// import bcrypt from "bcrypt";
import { fetchApi } from "lib/api";
import { UserResponseType } from "type/user";

// NextAuth 함수를 호출하여 인증 시스템을 구성하고, 여러 유틸리티를 내보냄
/*
  handlers : API 라우트 핸들러 (GET/POST 요청 처리)
  signIn : 프로그래밍 방식으로 로그인을 진행하는 함수
  signOut : 로그아웃 함수
  auth : 현재 인증 상태를 확인하는 함수
*/
export const { handlers, signIn, signOut, auth } = NextAuth({
  // providers 배열에는 다양한 인증 제공자를 추가할 수 있다.
  providers: [
    Credentials({
      name: "Credentials",
      // 로그인폼에 표시할 필드를 정의한다.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "RememberMe", type: "text" },
      },
      // authorize : 사용자 자격 증명을 검증하는 함수
      async authorize(credentials) {
        // API 서버를 통한 로그인 요청
        try {
          const response: UserResponseType = await fetchApi("/users/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          // 로그인 성공 확인
          if (response.ok === 1) {
            // NextAuth가 기대하는 형식으로 변환
            return {
              id: response.item._id.toString(),
              // 토큰 정보도 포함할 수 있음
              accessToken: response.item.token.accessToken,
              refreshToken: response.item.token.refreshToken,
              // 자동로그인이 true인지 아닌지 추가
              rememberMe: credentials.rememberMe === "true",
            };
          }

          // 로그인 실패시
          return null;
        } catch (error) {
          console.error("로그인 오류:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.rememberMe = user.rememberMe;

        // rememberMe 값에 따라 토큰 만료 시간 설정
        if (user.rememberMe) {
          token.exp = Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // JWT 토큰에서 세션으로 accessToken 복사
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      // 기존 사용자 정보도 유지
      session.user = {
        ...session.user,
        _id: token.sub,
      };

      return session;
    },
  },
  basePath: "/api/auth",
  pages: {
    signIn: "/users/login",
  },
  secret: process.env.AUTH_SECRET,
  debug: true, // 디버그 모드 활성화
});
