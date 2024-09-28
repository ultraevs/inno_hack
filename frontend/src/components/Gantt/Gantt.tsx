"use client";

import React, { useState, useEffect, useRef } from "react";
import { ViewMode, Gantt as GanttChart, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchProjectInfo } from "@/store/project/actions";

const Gantt = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(store => store.profile.projects)

  const tasks: Task[] = [
    {
      start: new Date(2023, 9, 1),
      end: new Date(2023, 9, 15),
      name: "Разработка приложения",
      id: "Task1",
      type: "task",
      progress: 20,
      dependencies: [],
      hideChildren: true,
    },
    {
      start: new Date(2023, 9, 16),
      end: new Date(2023, 9, 31),
      name: "Тестирование",
      id: "Task2",
      type: "task",
      progress: 0,
      dependencies: ["Task1"],
      hideChildren: true,
    },
  ];

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  
//   const projects_id = project.
//   console.log(projects)

  return (
    <div ref={ganttContainerRef} className={styles.ganttWrapper}>
      <GanttChart
        tasks={tasks}
        viewMode={viewMode}
        listCellWidth="200px"
        columnWidth={150}
      />
    </div>
  );
};

export { Gantt };
