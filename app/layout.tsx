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

  verification: {
    google:
      "google8f76aeea59caa5ae.html",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >

      <head>

        {/* ✅ GOOGLE ADS TAG */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18120955506"
        />

        {/* ✅ GOOGLE ADS CONFIG */}
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
          h-full
          bg-[#f5f5f7]
        "
      >

        {/* ===================== */}
        {/* GLOBAL HEADER */}
        {/* ===================== */}

        <Header />

        {/* ===================== */}
        {/* PAGE CONTENT */}
        {/* ===================== */}

        <main className="pt-16 pb-24">

          {children}

        </main>

        {/* ===================== */}
        {/* GLOBAL FOOTER */}
        {/* ===================== */}

        <Footer />

      </body>

    </html>
  );
}