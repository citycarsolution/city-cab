import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// ✅ COMPONENTS
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "City Cab Solution",
  description:
    "Premium cab booking service in Mumbai, Pune & Outstation rides.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
      `}
    >
      <head>

        {/* ========================= */}
        {/* GOOGLE SITE VERIFICATION */}
        {/* ========================= */}

        <meta
          name="google-site-verification"
          content="google8f76aeea59caa5ae"
        />

        {/* ========================= */}
        {/* GOOGLE ADS TAG */}
        {/* ========================= */}

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18120955506"
        />

        <Script id="google-ads">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag(
              'config',
              'AW-18120955506'
            );
          `}
        </Script>

      </head>

      <body
        className="
          min-h-screen
          bg-[#f5f5f7]
          text-black
        "
      >

        {/* ========================= */}
        {/* GLOBAL HEADER */}
        {/* ========================= */}

        <Header />

        {/* ========================= */}
        {/* PAGE CONTENT */}
        {/* ========================= */}

        <main className="pt-16 pb-20">

          {children}

        </main>

        {/* ========================= */}
        {/* GLOBAL FOOTER */}
        {/* ========================= */}

        <Footer />

      </body>
    </html>
  );
}