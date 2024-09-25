import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {
  readonly username: string;
}

const Username: FC<IProps> = (props) => {
  const { username } = props;

  return (
    <div className={styles.username}>
      <p>{username}</p>
    </div>
  );
};

export { Username };
