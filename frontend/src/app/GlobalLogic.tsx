"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchMeetings,
  fetchUserInfo,
  fetchUserProjects,
  fetchUserStats,
} from "@/store/profile/actions";
import { fetchAllUsers } from "@/store/project/actions";

const GlobalLogic = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchUserStats());
    dispatch(fetchUserProjects());
    dispatch(fetchMeetings());
    dispatch(fetchAllUsers())
  }, []);

  return <></>;
};

export { GlobalLogic };
