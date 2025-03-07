import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "components/providers/RQProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
