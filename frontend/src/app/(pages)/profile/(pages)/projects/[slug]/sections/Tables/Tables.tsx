import React from "react";
import styles from "./styles.module.scss";
import { EditableTable } from "@/components/EditableTable";

const Tables = () => {
  return (
    <section className={styles.section}>
      <h5>Задачи проекта</h5>
      <div className={styles.section__tables}>
        <EditableTable />
      </div>
    </section>
  );
};

export { Tables };
