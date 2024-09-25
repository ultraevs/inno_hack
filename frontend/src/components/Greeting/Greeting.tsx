import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {
  readonly userName: string;
}

const Greeting: FC<IProps> = (props) => {
  const { userName } = props;

  return (
    <div className={styles.greeting}>
      <h2>Добрый вечер, {userName}!</h2>
      <p>Рады видеть вас снова</p>
    </div>
  );
};

export { Greeting };
