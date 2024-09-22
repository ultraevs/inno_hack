import React, { FC } from "react";
import styles from "./styles.module.scss";
import { LinearProgressBar } from "../LinearProgressBar";

interface IProps {
  readonly projectName: string;
  readonly progress: number;
}

const ProjectProgress: FC<IProps> = (props) => {
  const { projectName, progress } = props;
  return (
    <div className={styles.progress}>
      <h3>{projectName}</h3>
      <div className={styles.progress__status}>
        <p>Прогресс</p>
        <LinearProgressBar percent={progress} />
      </div>
    </div>
  );
};

export { ProjectProgress };
