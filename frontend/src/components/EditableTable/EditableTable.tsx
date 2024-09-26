"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";
import { SelectForm } from "../SelectForm";

interface Row {
  name: string;
  user: string;
  status: string;
}

interface EditableTableState {
  rows: Row[];
  newRow: Row;
  editing: boolean;
}

const EditableTable: React.FC = () => {
  const [state, setState] = useState<EditableTableState>({
    rows: [],
    newRow: { name: "", user: "", status: "" },
    editing: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      newRow: { ...prevState.newRow, [name]: value },
    }));
  };

  const handleInputChangeInSelect = (
    index: number,
    name: string,
    newValue: string,
  ) => {
    setState((prevState) => ({
      ...prevState,
      newRow: { ...prevState.newRow, [name]: newValue },
    }));
  };

  const addRow = () => {
    setState((prevState) => ({
      ...prevState,
      editing: true,
    }));
  };

  const saveRow = () => {
    setState((prevState) => ({
      ...prevState,
      rows: [...prevState.rows, prevState.newRow],
      newRow: { name: "", user: "", status: "" },
      editing: false,
    }));
  };

  const updateRow = (index: number, column: keyof Row, value: string) => {
    const updatedRows = state.rows.map((row, i) => {
      if (i === index) {
        return { ...row, [column]: value };
      }
      return row;
    });

    setState((prevState) => ({
      ...prevState,
      rows: updatedRows,
    }));
  };

  const deleteRow = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      rows: prevState.rows.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.editableTable}>
      <table className={styles.editableTable__table}>
        <thead>
          <tr>
            <th style={{ width: "27%" }}>Название</th>
            <th style={{ width: "24%" }}>Исполнитель</th>
            <th style={{ width: "20%" }}>Статус</th>
            <th style={{ width: "29%" }}>Настройки</th>
          </tr>
        </thead>
        <tbody className={styles.editableTable__table__body}>
          {state.rows.map((row, index) => (
            <tr key={index} className={styles.editableTable__table__body__row}>
              <td>
                <input
                  type="text"
                  name="name"
                  value={row.name}
                  onChange={(e) => updateRow(index, "name", e.target.value)}
                  placeholder="Название"
                />
              </td>
              <td>
                <SelectForm
                  index={index}
                  name="user"
                  value={row.user}
                  placeholder="Исполнитель"
                  items={["Kostya", "Gleb"]}
                  setValue={updateRow}
                  isUsernames
                />
              </td>
              <td className={styles.editableTable__table__body__row__status}>
                <SelectForm
                  index={index}
                  name="status"
                  value={row.status}
                  placeholder="Статус"
                  items={["done", "in progress", "not started"]}
                  setValue={updateRow}
                />
              </td>
              <td>
                <button onClick={() => deleteRow(index)}>Удалить</button>
              </td>
            </tr>
          ))}
          {state.editing && (
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  value={state.newRow.name}
                  onChange={handleInputChange}
                  placeholder="Название"
                />
              </td>
              <td>
                <SelectForm
                  index={state.rows.length}
                  name="user"
                  value={state.newRow.user}
                  placeholder="Исполнитель"
                  items={["Kostya", "Gleb"]}
                  setValue={handleInputChangeInSelect}
                  isUsernames
                />
              </td>
              <td>
                <SelectForm
                  index={state.rows.length}
                  name="status"
                  value={state.newRow.status}
                  placeholder="Статус"
                  items={["done", "in progress", "not started"]}
                  setValue={handleInputChangeInSelect}
                />
              </td>
              <td>
                <button onClick={saveRow}>Сохранить</button>
              </td>
            </tr>
          )}
          {!state.editing && (
            <tr className={styles.editableTable__table__body__addRow}>
              <td
                colSpan={1}
                className={styles.editableTable__table__body__addRow__data}
              >
                <button
                  onClick={addRow}
                  className={
                    styles.editableTable__table__body__addRow__data__btn
                  }
                >
                  <span>+</span> Добавить
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { EditableTable };
