"use client"

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function IsAuth(props: P) {
    const router = useRouter();

    useEffect(() => {
      const isAuth = localStorage.getItem("isAuth") === "true";
      const token = getCookie("Authtoken");

      if (!isAuth || !token) {
        router.push("/signin");
      }
    }, [router]);

    return <Component {...props} />;
  };
};

export { withAuth };
