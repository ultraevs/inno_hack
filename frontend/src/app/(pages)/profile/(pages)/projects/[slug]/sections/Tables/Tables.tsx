import React from "react";
import styles from "./styles.module.scss";
import { EditableTable } from "@/components/EditableTable";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";

const Tables = () => {
  const params = useParams();
  const userProjects = useAppSelector((store) => store.profile.projects);
  const tasks = useAppSelector((store) => store.project.tasks);

  const projectId = Number(params.slug);

  const projectInfo = userProjects.find((item) => item.id === projectId);

  return (
    <section className={styles.section}>
      <h5>Задачи проекта</h5>
      {projectInfo && (
        <div className={styles.section__tables}>
          <EditableTable projectInfo={projectInfo} items={tasks} />
        </div>
      )}
    </section>
  );
};

export { Tables };
