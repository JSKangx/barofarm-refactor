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
      },
      // authorize : 사용자 자격 증명을 검증하는 함수
      async authorize(credentials) {
        // db에 직접 접근
        // if (!process.env.MONGODB_URI) {
        //   throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
        // }
        // // 바로팜 MongoDB 가져오기
        // const client = await MongoClient.connect(process.env.MONGODB_URI);
        // const db = client.db("final04");

        // try {
        //   // 이메일로 유저 찾기 쿼리 수행
        //   const user = await db.collection("user").findOne({
        //     email: credentials.email,
        //   });

        //   // 사용자가 존재하는지 확인
        //   if (!user) {
        //     await client.close();
        //     return null; // 사용자를 찾을 수 없음
        //   }

        //   // password 타입 가드
        //   if (typeof credentials.password !== "string") {
        //     await client.close();
        //     return null;
        //   }

        //   // bcrypt를 사용한 비밀번호 검증
        //   const isValid = await bcrypt.compare(
        //     credentials.password,
        //     user.password
        //   );

        //   // 비밀번호가 일치하지 않으면 null 반환
        //   if (!isValid) {
        //     await client.close();
        //     return null;
        //   }

        //   // 비밀번호가 일치하면 사용자 정보 반환
        //   await client.close();
        //   return {
        //     id: user._id.toString(),
        //     name: user.name || user.username,
        //     email: user.email,
        //     accessToken: user.accessToken,
        //   };
        // } catch (error) {
        //   console.error("인증 오류", error);
        //   await client.close();
        //   return null;
        // }

        // API 서버를 통한 로그인 요청
        try {
          const response: UserResponseType = await fetchApi("/users/login", {
            method: "POST",
            body: JSON.stringify(credentials),
          });
          // 로그인 성공 확인
          if (response.ok === 1) {
            // NextAuth가 기대하는 형식으로 변환
            return {
              id: response.item._id.toString(),
              name: response.item.name,
              image: response.item.image,
              // 토큰 정보도 포함할 수 있음
              accessToken: response.item.token.accessToken,
              refreshToken: response.item.token.refreshToken,
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
        id: token.id as string,
      };

      return session;
    },
  },
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET,
  debug: true, // 디버그 모드 활성화
});
