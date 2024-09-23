import React from "react";
import styles from "./page.module.scss";
import { EditableTable } from "@/components/EditableTable";

export default function ProjectSlug({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <div className={styles.page}>
      <h1>Project {slug}</h1>
      <div className={styles.page__table}>
        <EditableTable />
      </div>
    </div>
  );
}
