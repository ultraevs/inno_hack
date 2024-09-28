"use client";

import React, { useState, useEffect, useRef, FC } from "react";
import { ViewMode, Gantt as GanttChart, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import styles from "./styles.module.scss";

interface IProps {
  readonly tasks: Array<{
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    progress?: number;
    dependencies?: number[];
  }>;
}

const Gantt: FC<IProps> = (props) => {
  const { tasks } = props;

  const formattedTasks: Task[] = tasks
    .filter((task) => task.start_time && task.end_time)
    .map((task) => ({
      start: new Date(task.start_time),
      end: new Date(task.end_time),
      name: task.title,
      id: task.id.toString(),
      type: "task",
      progress: task.progress || 0,
      dependencies: task.dependencies ? task.dependencies.map((d) => d.toString()) : [],
      hideChildren: true,
      styles: {
        backgroundColor: "#69A7B4",
        progressColor: "#56837D", 
      },
    }));

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const ganttContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={ganttContainerRef} className={styles.ganttWrapper}>
      {formattedTasks.length > 0 ? (
        <GanttChart
          tasks={formattedTasks}
          viewMode={viewMode}
          listCellWidth="200px"
          columnWidth={120}
        />
      ) : (
        <p>Loading tasks...</p> 
      )}
    </div>
  );
};

export { Gantt };
