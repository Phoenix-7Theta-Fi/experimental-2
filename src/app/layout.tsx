import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Tangerine Health - Patient Portal",
  description: "Your personal healthcare management platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClasses = cn(
    inter.variable,
    'antialiased',
    'min-h-screen',
    'font-sans'
  );

  return (
    <html lang="en">
      <body className={bodyClasses}>
        {children}
      </body>
    </html>
  );
}
