import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import plusIcon from "@/assets/plus.svg";

const CreateProject = () => {
  return (
    <div className={styles.createProject}>
      <h4>Создать проект</h4>
      <button>
        <Image src={plusIcon} alt="plus icon" />
      </button>
    </div>
  );
};

export { CreateProject };
