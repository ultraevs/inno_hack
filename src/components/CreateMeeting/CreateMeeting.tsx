import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import plusIcon from "@/assets/plus2.svg";

const CreateMeeting = () => {
  return (
    <div className={styles.createMeeting}>
      <h4>Назначить конференцию</h4>
      <button>
        <Image src={plusIcon} alt="plus icon" />
      </button>
    </div>
  );
};

export { CreateMeeting };
