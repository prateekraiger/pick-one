import type { Metadata, Viewport } from "next";
import { Caveat, Kalam, Nunito } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["300", "400", "700"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://pick-one.vercel.app";
const SITE_TITLE = "Pick One — The Paper Slip Decision Bowl";
const SITE_DESCRIPTION =
  "Can't decide? Write your options on paper slips, drop them in the bowl, and let Pick One randomly choose for you. Free, private, and playful — no sign-up needed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "decision maker",
    "random picker",
    "lucky draw",
    "random name picker",
    "decision helper",
    "spin the wheel alternative",
  ],
  authors: [{ name: "Pick One" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Pick One",
    images: [
      {
        url: "/og-image.png",
        width: 1376,
        height: 768,
        alt: "A wooden bowl full of paper slips — Pick One decision helper",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf3e2" },
    { media: "(prefers-color-scheme: dark)", color: "#1c140d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${caveat.variable} ${kalam.variable} ${nunito.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
