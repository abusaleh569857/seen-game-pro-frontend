import Script from "next/script";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import ReduxProvider from "@/providers/ReduxProvider";
import {
  DEFAULT_LANGUAGE,
  isRtlLocale,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
} from "@/lib/i18n-settings";

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const initialLanguage = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LANGUAGE
  );
  const dir = isRtlLocale(initialLanguage) ? "rtl" : "ltr";

  return (
    <html lang={initialLanguage} dir={dir} suppressHydrationWarning>
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
        <ReduxProvider initialLanguage={initialLanguage}>
          <AppShell>{children}</AppShell>
        </ReduxProvider>
      </body>
    </html>
  );
}
