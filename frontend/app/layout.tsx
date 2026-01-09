import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Create and manage custom quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <body
        className={`${roboto.variable} antialiased bg-gray-900 text-gray-100`}
      >
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
