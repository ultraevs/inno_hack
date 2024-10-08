import { IRouteItem } from "./types";
import mainIcon from "@/assets/house.svg";
import projectsIcon from "@/assets/panels-top-left.svg";
import notificationsIcon from "@/assets/bell.svg";
import statisticIcon from "@/assets/statisticIcon.svg";

export const authRoutes: IRouteItem[] = [
  { title: "Войти", link: "/signin" },
  { title: "Загеристрироваться", link: "/signup" },
];

export const profileRoutes: IRouteItem[] = [
  { title: "Главная", link: "/profile", img: mainIcon },
  { title: "Проекты", link: "/profile/projects", img: projectsIcon },
  {
    title: "Уведомления",
    link: "/profile/notifications",
    img: notificationsIcon,
  },
  { title: "Статистика", link: "/profile/statistic", img: statisticIcon },
];

export const routes = {
  main: "/",
  auth: {
    signin: "/signin",
    signup: "/signup",
  },
  profile: {
    main: "/profile/main",
    projects: "/profile/projects",
    notifications: "/profile/notifications",
    settings: "/profile/settings",
  },
};
