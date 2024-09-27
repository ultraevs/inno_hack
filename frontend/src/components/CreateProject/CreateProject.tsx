import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import plusIcon from "@/assets/plus.svg";

const CreateProject = () => {
  return (
    <button className={styles.createProject}>
      <h4>Создать проект</h4>
      <div>
        <Image src={plusIcon} alt="plus icon" />
      </div>
    </button>
  );
};

export { CreateProject };
