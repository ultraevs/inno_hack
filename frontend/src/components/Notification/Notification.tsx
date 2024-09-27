import React, { FC } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import greenArrow from "@/assets/greenArrow.svg";
import redCircle from "@/assets/redCircle.svg";

interface IProps {
  item: any;
}

const Notification: FC<IProps> = (props) => {
  const { item } = props;
  
  return (
    <li className={styles.notification}>
      <p>{item.text}</p>
      <div className={styles.notification__actions}>
        <button>
          <Image src={greenArrow} alt="green arrow" />
        </button>
        <button>
          <Image src={redCircle} alt="red circle" />
        </button>
      </div>
    </li>
  );
};

export { Notification };
