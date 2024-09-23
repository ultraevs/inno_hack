import React from "react";
import styles from "./page.module.scss";
import { Greeting } from "@/components/Greeting";
import { ProjectProgress } from "@/components/ProjectProgress";
import { Statistics } from "@/components/Statistics";
import { Username } from "@/components/Username";
import { CreateProject } from "@/components/CreateProject";
import { Calendar } from "@/components/Calendar";
import { Meeting } from "@/components/Meeting";
import { CreateMeeting } from "@/components/CreateMeeting";

const exampleIconUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Profile() {
  return (
    <div className={styles.page}>
      <div className={styles.page__firstColumn}>
        <Greeting userName="Kostya" />
        <ProjectProgress projectName="Хакатон" progress={50} />
        <ProjectProgress projectName="Хакатон" progress={50} />
        <ProjectProgress projectName="Хакатон" progress={50} />
        <ProjectProgress projectName="Хакатон" progress={50} />
        <Statistics value={11} actionName="Часов работы" />
        <Statistics value={11} actionName="Часов работы" />
        <Statistics value={11} actionName="Часов работы" />
      </div>
      <div className={styles.page__secondColumn}>
        <Username username="Kostya" />
        <CreateProject />
        <div className={styles.page__secondColumn__widgets}>
          <Calendar />
          <div className={styles.page__secondColumn__widgets__meetings}>
            <Meeting
              projectName="Хакатон"
              date="2024-09-19 10:23"
              images={[exampleIconUrl, exampleIconUrl, exampleIconUrl]}
              link="https://itatmisis.ru/"
            />
            <Meeting
              projectName="Хакатон"
              date="2024-09-19 10:23"
              images={[exampleIconUrl, exampleIconUrl, exampleIconUrl]}
              link="https://itatmisis.ru/"
            />
            <CreateMeeting />
          </div>
        </div>
      </div>
    </div>
  );
}
