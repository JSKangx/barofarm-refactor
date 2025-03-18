import type NextAuth, { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * User 타입 확장
   */
  interface User {
    accessToken?: string;
    refreshToken?: string;
    image?: string;
    rememberMe?: boolean;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    kakaoId?: string | null;
    user: {
      _id?: string | number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string | number;
    provider?: string;
    kakaoId?: string | null;
    exp?: number;
  }
}

// TypeScript를 만족시키기 위한 임시 방편
const _unused = { NextAuth, JWT };
console.log(_unused);
