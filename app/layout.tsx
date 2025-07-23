import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { HealthChecker } from "@/components/HealthChecker";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "English Learning Platform",
  description:
    "Master English through AI-powered conversations and assessments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${workSans.className} min-h-screen`}>
        <HealthChecker />
        {children}
      </body>
    </html>
  );
}
