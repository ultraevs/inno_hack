"use client";

import React, { FC } from "react";
import styles from "./styles.module.scss";
import { SelectForm } from "../SelectForm";
import { ITask } from "@/store/project/projectSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createTask,
  deleteTask,
  generateTask,
  updateTask,
} from "@/store/project/actions";
import { DeleteOutlined } from "@ant-design/icons";
import ReactInputMask from "react-input-mask";
import { IProject } from "@/store/profile/profileSlice";
import { getCookie } from "cookies-next";

interface IProps {
  projectInfo: IProject;
  items: ITask[];
}

const EditableTable: FC<IProps> = (props) => {
  const { projectInfo, items } = props;

  const users = useAppSelector((store) => store.project.users);

  const projectId = projectInfo.id;
  const description = projectInfo.description ? projectInfo.description : "";
  const tasks = items.map((item) => {
    return item.title;
  });
  const authtoken = getCookie("Authtoken") || "";

  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: ITask,
  ) => {
    const { name, value } = e.target;

    const changes = { [name]: value };

    dispatch(updateTask({ projectId, taskId: row.id, changes }));
  };

  const addRow = () => {
    dispatch(createTask({ projectId, title: "1" }));
  };

  const updateRow = (index: number, name: string, value: string) => {
    const changes = { [name]: value };
    dispatch(updateTask({ projectId, taskId: index, changes }));
  };

  const deleteRow = (row: ITask) => {
    dispatch(deleteTask({ projectId, taskId: row.id }));
  };

  const generateRow = () => {
    dispatch(
      generateTask({
        description,
        tasks,
        project_id: projectId,
        Authtoken: authtoken,
      }),
    );
  };

  return (
    <div className={styles.editableTable}>
      <table className={styles.editableTable__table}>
        <thead>
          <tr>
            <th style={{ width: "27%" }}>Название</th>
            <th style={{ width: "17.5%" }}>Исполнитель</th>
            <th style={{ width: "17.5%" }}>Статус</th>
            <th style={{ width: "15%" }}>Начало</th>
            <th style={{ width: "15%" }}>Конец</th>
            <th style={{ width: "8%" }}>delete</th>
          </tr>
        </thead>
        <tbody className={styles.editableTable__table__body}>
          {items.map((row, index) => (
            <tr key={index} className={styles.editableTable__table__body__row}>
              <td
                style={{
                  background: row.title.includes("#ai") ? "#F2EFFF" : undefined,
                }}
              >
                <input
                  type="text"
                  name="title"
                  value={row.title}
                  onChange={(e) => handleInputChange(e, row)}
                  placeholder="Название"
                />
              </td>
              <td>
                <SelectForm
                  index={row.id}
                  name="assignee_name"
                  value={row.assignee_name}
                  placeholder="Исполнитель"
                  items={users}
                  setValue={updateRow}
                  isUsernames
                />
              </td>
              <td className={styles.editableTable__table__body__row__status}>
                <SelectForm
                  index={row.id}
                  name="status"
                  value={row.status}
                  placeholder="Статус"
                  items={["done", "in progress", "not started"]}
                  setValue={updateRow}
                />
              </td>
              <td>
                <ReactInputMask
                  name="start_time"
                  value={row.start_time}
                  maskChar={null}
                  mask={"9999-99-99"}
                  onChange={(e) => handleInputChange(e, row)}
                  placeholder="ГГГГ-ММ-ДД"
                />
              </td>
              <td>
                <ReactInputMask
                  name="end_time"
                  value={row.end_time}
                  maskChar={null}
                  mask={"9999-99-99"}
                  onChange={(e) => handleInputChange(e, row)}
                  placeholder="ГГГГ-ММ-ДД"
                />
              </td>
              <td>
                <button onClick={() => deleteRow(row)}>
                  <DeleteOutlined />
                </button>
              </td>
            </tr>
          ))}
          <tr className={styles.editableTable__table__body__addRow}>
            <td
              colSpan={1}
              className={styles.editableTable__table__body__addRow__data}
            >
              <button
                onClick={generateRow}
                className={styles.editableTable__table__body__addRow__data__btn}
              >
                <span>+</span> Сгенерировать
              </button>
            </td>
          </tr>
          <tr className={styles.editableTable__table__body__addRow}>
            <td
              colSpan={1}
              className={styles.editableTable__table__body__addRow__data}
            >
              <button
                onClick={addRow}
                className={styles.editableTable__table__body__addRow__data__btn}
              >
                <span>+</span> Добавить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { EditableTable };

// assignee_name: string;
//   deadline: string;
//   description: string;
//   duration: string;
//   end_time: string;
//   id: number;
//   start_time: string;
//   status: string;
//   title: string;
