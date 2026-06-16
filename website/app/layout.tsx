import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL('https://yance.ai'),
  title: "YanCe Policy Agent — 园区公司的政策服务Agent | yance.ai",
  description:
    "为园区、孵化器、产业服务机构提供政策问答、企业画像、资源匹配、材料清单和企业服务工作台。Turn policy alerts into park impact.",
  keywords:
    "政策Agent, 园区服务, 政策匹配, 企业画像, Policy Agent, 产业园区",
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "YanCe Policy Agent",
    description: "政策复杂，但园区服务可以更清楚。",
    url: "https://yance.ai",
    siteName: "YanCe Policy Agent",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: '/logo.png',
        width: 1254,
        height: 1254,
        alt: 'YanCe Policy Agent',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          跳转到主要内容
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
