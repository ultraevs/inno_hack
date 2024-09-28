import React, { FC } from "react";
import styles from "./styles.module.scss";
import { LinearProgressBar } from "../LinearProgressBar";
import { IProject } from "@/store/profile/profileSlice";
import { useRouter } from "next/navigation";
import { routes } from "@/consts/routes";

interface IProps {
  readonly item: IProject;
}

const ProjectProgress: FC<IProps> = (props) => {
  const { item } = props;

  const router = useRouter();

  const handleClick = () => {
    router.push(`${routes.profile.projects}/${item.id}`);
  };

  return (
    <div className={styles.progress} onClick={handleClick}>
      <h3>{item.name}</h3>
      <div className={styles.progress__status}>
        <p>Прогресс</p>
        <LinearProgressBar percent={0} />
      </div>
    </div>
  );
};

export { ProjectProgress };
