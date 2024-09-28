import React from "react";
import styles from "./styles.module.scss";
import { EditableTable } from "@/components/EditableTable";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";

const Tables = () => {
  const params = useParams();
  const tasks = useAppSelector(store => store.project.tasks)

  const projectId = Number(params.slug)
  
  return (
    <section className={styles.section}>
      <h5>Задачи проекта</h5>
      <div className={styles.section__tables}>
        <EditableTable projectId={projectId} items={tasks} />
      </div>
    </section>
  );
};

export { Tables };
