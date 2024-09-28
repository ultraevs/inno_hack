"use client";

import React, { useEffect } from "react";
import styles from "./page.module.scss";
import { Notification } from "@/components/Notification";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserInvitations } from "@/store/profile/actions";

export default function Notifications() {
  const dispatch = useAppDispatch()

  const userInvites = useAppSelector((store) => store.profile.invitations)

  useEffect(() => {
    dispatch(fetchUserInvitations())
  }, [])

  return (
    <div className={styles.page}>
      {!userInvites.length ? (
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
