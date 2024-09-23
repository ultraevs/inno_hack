import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {
  readonly percent: number;
}

const LinearProgressBar: FC<IProps> = (props) => {
  const { percent } = props;

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressBar__filledZone}
        style={{
          left: percent - 100 + "%",
          transition: "3s",
        }}
      ></div>
    </div>
  );
};

export { LinearProgressBar };
