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
import { auth } from "auth";
import UserDataLoader from "components/_/UserDataLoader";
import { Slide, ToastContainer } from "react-toastify";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/icons/BaroFarmIcon.png",
  },
  title: "바로Farm",
  description: "소규모 생산자와 구매자 간의 농수산물 직거래 플랫폼",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} antialiased max-w-[390px] mx-auto`}
      >
        <Providers>
          {session?.user?._id && <UserDataLoader userId={session.user._id} />}
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
