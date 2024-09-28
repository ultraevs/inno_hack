"use client";

import Image from "next/image";
import styles from "@/styles/auth.module.scss";
import cn from "classnames";
import authLogo from "@/assets/authLogo.svg";
import { authRoutes } from "@/consts/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/auth/actions";

export default function Signin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const isLinkActive = (route: string): boolean => route === pathname;

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <main className={styles.page}>
      <div className={styles.page__container}>
        <Image src={authLogo} alt="логотип" />
        <div className={styles.page__container__nav}>
          {authRoutes.map((route) => (
            <button
              key={route.title}
              className={cn(
                styles.page__container__nav__btn,
                isLinkActive(route.link) && styles.active,
              )}
            >
              <Link href={route.link}>{route.title}</Link>
            </button>
          ))}
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) =>
            dispatch(loginUser(values))
              .unwrap()
              .then((data) => {
                if (data.success) {
                  router.push("/profile");
                }
              })
          }
        >
          <Form className={styles.page__container__nav__form}>
            <div className={styles.page__container__nav__form__fields}>
              <label>
                Почта
                <Field name="email" placeholder="Введите электронную почту" />
              </label>
              <label>
                Пароль
                <Field name="password" placeholder="Введите пароль" />
              </label>
            </div>
            <button type="submit">Войти</button>
          </Form>
        </Formik>
      </div>
    </main>
  );
}
