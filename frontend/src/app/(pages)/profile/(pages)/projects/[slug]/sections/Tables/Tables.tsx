import React from "react";
import styles from "./styles.module.scss";
import { EditableTable } from "@/components/EditableTable";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";

const Tables = () => {
  const params = useParams();
  const userProjects = useAppSelector((store) => store.profile.projects);
  const tasks = useAppSelector((store) => store.project.tasks);

  const projectId = Number(params.slug);

  const projectInfo = userProjects.find((item) => item.id === projectId);

  return (
    <section className={styles.section}>
      <div>
        <h5>Задачи проекта</h5>
        {projectInfo && (
          <div className={styles.section__tables}>
            <EditableTable projectInfo={projectInfo} items={tasks} />
          </div>
        )}
      </div>
      <div>
        <h5>Figma макет</h5>
        <div className={styles.section__tables}>
          <table className={styles.editableTable__table}>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Новых фреймов</th>
                <th style={{ width: "25%" }}>Измененных объектов</th>
                <th style={{ width: "25%" }}>Удаленных объектов</th>
                <th style={{ width: "25%" }}>Новых объектов</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>3</p>
                </td>
                <td>
                  <p>5</p>
                </td>
                <td>
                  <p>12</p>
                </td>
                <td>
                  <p>72</p>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="#">Перейти</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.section__block}>
        <h5>Изменения</h5>
        <div className={styles.section__tables}>
          <table className={styles.editableTable__table}>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Фрейм</th>
                <th style={{ width: "25%" }}>Количество изменений</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>main</p>
                </td>
                <td>
                  <p>5</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>chat</p>
                </td>
                <td>
                  <p>7</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>project</p>
                </td>
                <td>
                  <p>1</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>notification page</p>
                </td>
                <td>
                  <p>31</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export { Tables };
