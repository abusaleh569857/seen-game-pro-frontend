import Script from "next/script";
import { Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import ReduxProvider from "@/providers/ReduxProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-noto-arabic",
  display: "swap",
});

/** @type {import('next').Metadata} */
export const metadata = {
  title: {
    template: "%s | Seen Game Pro",
    default: "Seen Game Pro - Quiz Platform",
  },
  description:
    "Multilingual interactive quiz platform. Arabic, English, French, Spanish.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-bg text-text-1 font-sans ${plusJakartaSans.variable} ${notoSansArabic.variable}`}
        suppressHydrationWarning
      >
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          strategy="afterInteractive"
        />
        <ReduxProvider>
          <AppShell>{children}</AppShell>
        </ReduxProvider>
      </body>
    </html>
  );
}
