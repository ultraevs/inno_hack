import styles from "./layout.module.scss";
import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";

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
    <div className={styles.container}>
      <div className={styles.layout}>
        <NavBar />
        <main>{children}</main>
      </div>
    </div>
  );
}
