import type { Metadata } from "next";
import { Rubik, Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const generalSans = localFont({
  src: "../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
});

export const metadata: Metadata = {
  title: "Sebastian Noel | Portfolio",
  description: "Sebastian Noel's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(rubik.variable, generalSans.variable, "font-sans", geist.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
