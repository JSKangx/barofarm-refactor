import MyPageClient from "components/_/users/MyPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "바로Farm 마이페이지",
};

export default async function MyPage() {
  return <MyPageClient />;
}
