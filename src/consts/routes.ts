import { IRouteItem } from "./types";

export const authRoutes: IRouteItem[] = [
  { title: "Войти", link: "/signin" },
  { title: "Загеристрироваться", link: "/signup" },
];

export const profileRoutes: IRouteItem[] = [
  { title: "Главная", link: "profile/main" },
  { title: "Проекты", link: "profile/projects" },
  { title: "Уведомления", link: "profile/notifications" },
  { title: "Настройки", link: "profile/settings" },
];

export const routes = {
  main: "/",
  auth: {
    signin: "/signin",
    signup: "/signup",
  },
  profile: {
    main: "profile/main",
    projects: "profile/projects",
    notifications: "profile/notifications",
    settings: "profile/settings",
  },
};
