"use client";

import React, { useEffect } from "react";
import styles from "./page.module.scss";
import { notFound, useSearchParams } from "next/navigation";
import { Tables } from "./sections/Tables";
import { ProjectData } from "./sections/ProjectData";
import { routes } from "@/consts/routes";
import Link from "next/link";
import { Assistant } from "@/components/Assistant";
import { useAppDispatch } from "@/store/hooks";
import { fetchProjectInfo } from "@/store/project/actions";
import { withAuth } from "@/hoc/withAuth";

const ProjectSlug = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("section") || "1";

  useEffect(() => {
    const id = Number(slug);

    if (id) {
      dispatch(fetchProjectInfo(id));
    }
  }, []);

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
      <Assistant />
    </div>
  );
}

export default withAuth(ProjectSlug)