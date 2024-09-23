import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {
  readonly hours: number;
}

const PersonalProjects: FC<IProps> = (props) => {
  const { hours } = props;

  return (
    <div className={styles.personalProjects}>
      <h2>Ваши проекты</h2>
      <p>Общее время работы: {hours}</p>
    </div>
  );
};
export { PersonalProjects };
