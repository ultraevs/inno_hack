"use client";

import React, { useEffect } from "react";
import styles from "./page.module.scss";
import { Notification } from "@/components/Notification";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserInvitations } from "@/store/profile/actions";
import { withAuth } from "@/hoc/withAuth";

const Notifications = () => {
  const dispatch = useAppDispatch();

  const userInvites = useAppSelector((store) => store.profile.invitations);

  useEffect(() => {
    dispatch(fetchUserInvitations());
  }, []);

  return (
    <div className={styles.page}>
      {!userInvites.length ? (
        <div className={styles.page__noData}>
          <h2>У вас пока нет уведомлений</h2>
        </div>
      ) : (
        <div className={styles.page__content}>
          <ul>
            {userInvites.map((invite) => (
              <Notification key={invite.id} item={invite} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default withAuth(Notifications);
