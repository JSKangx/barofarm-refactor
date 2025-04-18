import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchApi } from "lib/api";
import { UserResponseType } from "type/user";
import Kakao from "next-auth/providers/kakao";

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
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 최초 로그인시 user가 들어옴.
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.rememberMe = user.rememberMe;

        // 자동 로그인에 따른 토큰 만료 시간 설정
        const now = Math.floor(Date.now() / 1000);
        if (user.rememberMe) {
          // 15일
          token.exp = now + 15 * 24 * 60 * 60;
        } else {
          // 1시간
          token.exp = now + 1 * 60 * 60;
        }
      }

      // 카카오 로그인 처리
      if (account && account.provider === "kakao") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = "kakao";
        token.kakaoId = profile?.id;

        // 카카오 로그인의 경우 만료 시간 설정 (15일)
        const now = Math.floor(Date.now() / 1000);
        token.exp = now + 15 * 24 * 60 * 60;
      }

      // 만료 시간 체크
      const currentTime = Math.floor(Date.now() / 1000);
      if (token.exp && currentTime > token.exp) {
        // 만료된 경우 빈 토큰 반환 (로그아웃 효과)
        return {};
      }

      return token;
    },
    async session({ session, token }) {
      // JWT 토큰에서 세션으로 필요한 정보 복사
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.provider = token.provider;

      // 카카오 로그인인 경우 kakaoId 추가
      if (token.provider === "kakao") {
        session.kakaoId = token.kakaoId;
      }

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
