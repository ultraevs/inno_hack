"use client";

import React from "react";
import styles from "./page.module.scss";
import { Notification } from "@/components/Notification";

export default function Notifications() {
  const count = 1;

  return (
    <div className={styles.page}>
      {!count ? (
        <div className={styles.page__noData}>
          <h2>У вас пока нет уведомлений</h2>
        </div>
      ) : (
        <div className={styles.page__content}>
          <ul>
            <Notification
              item={{
                text: "Crowdy#2280 приглашает Вас в проект Selectel hack",
              }}
            />
          </ul>
        </div>
      )}
    </div>
  );
}
