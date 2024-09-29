import React, { FC } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import greenArrow from "@/assets/greenArrow.svg";
import redCircle from "@/assets/redCircle.svg";
import { IInvite } from "@/store/profile/profileSlice";

interface IProps {
  item: IInvite;
}

const Notification: FC<IProps> = (props) => {
  const { item } = props;

  return (
    <li className={styles.notification}>
      <p>
        Проект: {item.project_name} / Вас пригласил: {item.inviter_name} / Ваша роль: {item.role}
      </p>
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
