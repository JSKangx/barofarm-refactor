import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

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
      async authorize(credentials): Promise<User | null> {
        if (!process.env.MONGODB_URI) {
          throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
        }
        // 바로팜 MongoDB 가져오기
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db("baroFarm");

        try {
          // 이메일로 유저 찾기 쿼리 수행
          const user = await db.collection("user").findOne({
            email: credentials.email,
          });

          // 사용자가 존재하는지 확인
          if (!user) {
            await client.close();
            return null; // 사용자를 찾을 수 없음
          }

          // password 타입 가드
          if (typeof credentials.password !== "string") {
            await client.close();
            return null;
          }

          // bcrypt를 사용한 비밀번호 검증
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // 비밀번호가 일치하지 않으면 null 반환
          if (!isValid) {
            await client.close();
            return null;
          }

          // 비밀번호가 일치하면 사용자 정보 반환
          await client.close();
          return {
            id: user._id.toString(),
            name: user.name || user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("인증 오류", error);
          await client.close();
          return null;
        }
      },
    }),
  ],
  basePath: "api/auth",
  secret: process.env.AUTH_SECRET,
});
