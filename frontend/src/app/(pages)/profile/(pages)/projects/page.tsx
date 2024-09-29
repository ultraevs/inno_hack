"use client";

import React from "react";
import styles from "./page.module.scss";
import { PersonalProjects } from "@/components/PersonalProjects";
import { Username } from "@/components/Username";
import { CreateProject } from "@/components/CreateProject";
import { ProjectProgress } from "@/components/ProjectProgress";
import { useAppSelector } from "@/store/hooks";
import { withAuth } from "@/hoc/withAuth";

const Projects = () => {
  const userInfo = useAppSelector((store) => store.profile.info);
  const userStats = useAppSelector((store) => store.profile.stats);
  const userProjects = useAppSelector((store) => store.profile.projects);

  if (!userInfo || !userStats) {
    return (
      <div className={styles.page}>
        <h2>Loading...</h2>
      </div>
    );
  }

  console.log(userProjects)

  return (
    <div className={styles.page}>
      <div className={styles.page__title}>
        <div className={styles.page__title__firstColumn}>
          <PersonalProjects hours={0} />
        </div>
        <div className={styles.page__title__secondColumn}>
          <Username username={userInfo.name} />
          <CreateProject />
        </div>
      </div>
      {userProjects?.length ? (
        <div className={styles.page__projects}>
          {userProjects?.map((project, index) => (
            <ProjectProgress
              key={index}
              item={project}
            />
          ))}
        </div>
      ) : (
        <div className={styles.page__noProjects}>
          <h3>У вас пока нет проектов</h3>
        </div>
      )}
    </div>
  );
}

export default withAuth(Projects)