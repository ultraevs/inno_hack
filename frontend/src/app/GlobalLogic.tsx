"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchUserInfo,
  fetchUserProjects,
  fetchUserStats,
} from "@/store/profile/actions";

const GlobalLogic = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(fetchUserStats());
    dispatch(fetchUserProjects());
  }, []);

  return <></>;
};

export { GlobalLogic };
