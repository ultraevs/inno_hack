import type { Metadata } from "next";
import "./globals.scss";

import { Ysabeau_Infant } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

const ysabeau_infant = Ysabeau_Infant({ subsets: [] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ysabeau_infant.className}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}