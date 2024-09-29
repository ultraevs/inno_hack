"use client";

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
import { useAppSelector } from "@/store/hooks";
import { withAuth } from "@/hoc/withAuth";
import { Print } from "@/components/Print";

const exampleIconUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = () => {
  const userInfo = useAppSelector((store) => store.profile.info);
  const userStats = useAppSelector((store) => store.profile.stats);
  const userProjects = useAppSelector((store) => store.profile.projects);
  const meetings = useAppSelector((store) => store.profile.meetings);

  if (!userInfo || !userStats) {
    return (
      <div className={styles.page}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.page__firstColumn}>
        <div className={styles.page__firstColumn__greeting}>
          <Greeting userName={userInfo.name} />
        </div>
        {userProjects?.length ? (
          <div className={styles.page__firstColumn__projects}>
            {userProjects?.slice(0, 4).map((project, index) => (
              <ProjectProgress key={index} item={project} />
            ))}
          </div>
        ) : (
          <div className={styles.page__firstColumn__noProjects}>
            <h3>У вас пока нет проектов</h3>
          </div>
        )}
        <div className={styles.page__firstColumn__stats}>
          <Statistics value={0} actionName="Часов работы" />
          <Statistics
            value={userStats.total_projects_count}
            actionName="Проекта"
          />
          <Statistics
            value={userStats.done_tasks_count}
            actionName="Заданий выполнено"
          />
        </div>
      </div>
      <div className={styles.page__secondColumn}>
        <Username username={userInfo.name} />
        <CreateProject />
        <div className={styles.page__secondColumn__widgets}>
          <Calendar />
          <div className={styles.page__secondColumn__widgets__meetings}>
            {meetings?.length ? (
              <div className={styles.page__secondColumn__widgets__meetings__have}>
                {[...meetings].reverse().slice(0, 2).map((meeting) => (
                  <Meeting
                    key={meeting.id}
                    projectName={meeting.name}
                    date={meeting.meetingDate}
                    images={[exampleIconUrl, exampleIconUrl, exampleIconUrl]}
                    link={meeting.zoom_link}
                  />
                ))}
              </div>
            ) : (
              <div
                className={
                  styles.page__secondColumn__widgets__meetings__noMeetings
                }
              >
                <h3>
                  Конференций <br /> не запланировано
                </h3>
              </div>
            )}
            <CreateMeeting />
          </div>
        </div>
        <div className={styles.page__secondColumn__beatiful}>
          <Print />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
