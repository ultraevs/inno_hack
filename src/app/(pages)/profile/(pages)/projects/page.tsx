import React from "react";
import styles from "./page.module.scss";
import { PersonalProjects } from "@/components/PersonalProjects";
import { Username } from "@/components/Username";
import { CreateProject } from "@/components/CreateProject";
import { ProjectProgress } from "@/components/ProjectProgress";

export default function Projects() {
  return (
    <div className={styles.page}>
      <div className={styles.page__title}>
        <div className={styles.page__title__firstColumn}>
          <PersonalProjects hours={11} />
        </div>
        <div className={styles.page__title__secondColumn}>
          <Username username="Kostya" />
          <CreateProject />
        </div>
      </div>
      <div className={styles.page__projects}>
        <ProjectProgress projectName="Хакатон" progress={50} />
      </div>
    </div>
  );
}
