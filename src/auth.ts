import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      // authorize : 사용자 자격 증명을 검증하는 함수
      async authorize(credentials): Promise<User | null> {
        const users = [
          {
            id: "test-user-1",
            userName: "test1",
            name: "Test 1",
            password: "pass",
            email: "test1@donotreply.com",
          },
          {
            id: "test-user-2",
            userName: "test2",
            name: "Test 2",
            password: "pass",
            email: "test2@donotreply.com",
          },
        ];

        const user = users.find(
          (user) =>
            user.userName === credentials.username &&
            user.password === credentials.password
        );

        return user
          ? { id: user.id, name: user.name, email: user.email }
          : null;
      },
    }),
  ],
  basePath: "api/auth",
  secret: process.env.AUTH_SECRET,
});
