"use client";

import React from "react";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import logOut from "@/assets/log-out.svg";
import { profileRoutes } from "@/consts/routes";

const NavBar = () => {
  const pathname = usePathname();

  const isLinkActive = (route: string): boolean => route === pathname;

  return (
    <aside className={styles.navBar}>
      <div className={styles.navBar__logo}>
        <Image src={logo} alt="logo" />
      </div>
      <div className={styles.navBar__panel}>
        <ul>
          {profileRoutes.map((route) => (
            <li
              key={route.title}
              className={isLinkActive(route.link) ? styles.active : undefined}
            >
              {route.img && <Image src={route.img} alt="img" />}
              <Link href={route.link}>{route.title}</Link>
            </li>
          ))}
        </ul>
        <button className={styles.navBar__panel__logOut}>
          <Image src={logOut} alt="log out" />
          <p>Выйти</p>
        </button>
      </div>
    </aside>
  );
};

export { NavBar };
