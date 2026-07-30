import type { Metadata } from "next";
import { Oswald, Inter, Tajawal } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const tajawal = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "PRODYOUS | Cinematic Studio — Video Ads, Drone & Editing",
  description:
    "PRODYOUS is a specialized cinematic studio delivering high-end video ads, drone cinematography, and precision editing. We architect every frame.",
  keywords: [
    "PRODYOUS",
    "video production",
    "drone cinematography",
    "video editing",
    "commercial ads",
    "aerial footage",
    "cinematic studio",
  ],
  icons: {
    icon: "/logo.jpg",
  },
  openGraph: {
    title: "PRODYOUS | Cinematic Studio",
    description: "Video Ads, Drone & Editing — We architect every frame.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${oswald.variable} ${inter.variable} ${tajawal.variable} antialiased`}
        style={{
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
