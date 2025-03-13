import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * User 타입 확장
   */
  interface User {
    accessToken?: string;
    refreshToken?: string;
    image?: string;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string | number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string | number;
  }
}
