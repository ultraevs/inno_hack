import React from "react";
import styles from "./styles.module.scss";
import { FontOptions } from "@/components/FontOptions";

const ProjectData = ({ projectId }: { projectId: number }) => {
  return (
    <section className={styles.section}>
      <FontOptions projectId={projectId} />
    </section>
  );
};

export { ProjectData };
