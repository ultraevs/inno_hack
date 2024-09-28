"use client";

import { Gantt } from "@/components/Gantt";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import { fetchAllTasks } from "@/store/gantt/acitons";
import styles from "./styles.module.scss";

interface Task {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  progress?: number;
  dependencies?: number[];
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const [projectTasks, setProjectTasks] = useState<Record<number, Task[]>>({});

  const projects = useAppSelector((store) => store.profile.projects);

  useEffect(() => {
    const fetchTasksForProjects = async () => {
      const tasksByProject: Record<number, Task[]> = {};

      for (const project of projects) {
        try {
          const result = await dispatch(fetchAllTasks(project.id)).unwrap();
          if (result.tasks && Array.isArray(result.tasks)) {
            tasksByProject[project.id] = result.tasks;
          }
        } catch (error) {
          console.error(`Failed to fetch tasks for project ID ${project.id}:`, error);
        }
      }

      setProjectTasks(tasksByProject);
    };

    if (projects.length > 0) {
      fetchTasksForProjects();
    }
  }, [dispatch, projects]);

  return (
    <div className={styles.grantt}>
      {projects.map((project) => (
        <div key={project.id} className={styles.grantt__project}>
          <h3>Project: {project.name}</h3>
          {projectTasks[project.id] ? (
            <Gantt tasks={projectTasks[project.id]} />
          ) : (
            <p>Loading tasks for project {project.name}...</p>
          )}
        </div>
      ))}
    </div>
  );
}
