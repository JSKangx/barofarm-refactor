import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "components/providers/RQProvider";
const DynamicHeader = dynamic(() => import("components/_/DynamicHeader"), {
  ssr: false,
  loading: () => <div className="h-[70px]"></div>,
});
import Navbar from "components/_/NavBar";
import { Suspense } from "react";
import Spinner from "components/Spinner";
import dynamic from "next/dynamic";
import UserDataLoader from "components/_/UserDataLoader";
import { Slide, ToastContainer } from "react-toastify";
import { cookies } from "next/headers";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/icons/BaroFarmIcon.png",
  },
  title: {
    template: "%s | 바로Farm",
    default: "바로 Farm",
  },
  description: "소규모 생산자와 구매자 간의 농수산물 직거래 플랫폼",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 로그인 확인용 쿠키
  const cookiesStore = cookies();
  const userId = cookiesStore.get("_id")?.value;
  const token = cookiesStore.get("accessToken")?.value;

  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} antialiased max-w-[390px] mx-auto`}
      >
        <Providers>
          {token && <UserDataLoader userId={userId} />}
          <DynamicHeader />
          <Suspense fallback={<Spinner />}>
            <main className="pb-[100px] pt-[70px]">{children}</main>
            <aside id="modal-root"></aside>
          </Suspense>
          <Navbar />
          <ToastContainer
            position="top-center"
            hideProgressBar={true}
            autoClose={2500}
            closeOnClick={true}
            theme="light"
            transition={Slide}
          />
        </Providers>
      </body>
    </html>
  );
}
