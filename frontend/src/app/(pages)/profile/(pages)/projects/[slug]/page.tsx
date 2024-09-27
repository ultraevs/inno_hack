"use client";

import React from "react";
import styles from "./page.module.scss";
import { notFound, useSearchParams } from "next/navigation";
import { Tables } from "./sections/Tables";
import { ProjectData } from "./sections/ProjectData";
import { routes } from "@/consts/routes";
import Link from "next/link";

export default function ProjectSlug({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("section") || "1";

  const renderSection = () => {
    switch (sectionId) {
      case "1":
        return <ProjectData />;
      case "2":
        return <Tables />;
      default:
        return notFound();
    }
  };

  const link =
    sectionId === "1"
      ? {
          title: "К таблице задач",
          link: `${routes.profile.projects}/${slug}?section=2`,
        }
      : {
          title: "К проекту",
          link: `${routes.profile.projects}/${slug}?section=1`,
        };

  const role = "frontend";
  return (
    <div className={styles.page}>
      <ul>
        <li>
          <Link href={link.link}>{link.title}</Link>
        </li>
        <li>{role}</li>
      </ul>
      <div className={styles.page__content}>{renderSection()}</div>
    </div>
  );
}
