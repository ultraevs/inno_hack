import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {
  readonly value: number;
  readonly actionName: string;
}

const Statistics: FC<IProps> = (props) => {
  const { value, actionName } = props;

  return (
    <div className={styles.statistics}>
      <h4>{value}</h4>
      <p>{actionName}</p>
      <div className={styles.statistics__shadow}></div>
    </div>
  );
};

export { Statistics };
