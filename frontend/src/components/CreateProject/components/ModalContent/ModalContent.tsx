import React, { FC, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Field, FieldArray, Form, Formik } from "formik";
import { SelectCustomField } from "@/components/SelectCustomField";

interface IProps {
  closeModal: () => void;
}

const ModalContent: FC<IProps> = (props) => {
  const { closeModal } = props;

  interface IInitialValues {
    projectName: string;
    users: { username: string; role: string }[];
    linkToFigma: string;
  }

  const initialValues: IInitialValues = {
    projectName: "",
    users: [{ username: "", role: "" }],
    linkToFigma: "",
  };

  const [values, setValues] = useState<IInitialValues>(initialValues);
  const [key, setKey] = useState<number>(0);

  const roles = [
    "Project Manager",
    "Machine Learning",
    "Computer Vision",
    "Frontend",
    "Backend",
    "Dev-Ops",
    "Designer",
    "Full-Stack",
  ];

  useEffect(() => {
    const lastIndex = values.users.length - 1;
    const lastUser = values.users[lastIndex];



    if (lastUser.username !== "" && lastUser.role !== "") {
      const newUsers = [...values.users, { username: "", role: "" }];

      setValues((prev) => ({
        ...prev,
        users: newUsers,
      }));

      setKey((prev) => prev + 1);
    }
  }, [values.users]);

  return (
    <div className={styles.content}>
      <Formik
        key={key}
        initialValues={values}
        onSubmit={(values) => console.log(values)}
      >
        {({ values }) => {
          return (
            <Form className={styles.content__form}>
              <div className={styles.content__form__fields}>
                <Field
                  name="projectName"
                  placeholder="Название проекта"
                  className={styles.content__form__fields__projectName}
                />
                <FieldArray name="users">
                  {() => (
                    <div className={styles.content__form__fields__users}>
                      {values.users.length > 0 &&
                        values.users.map((user, index) => (
                          <div
                            key={index}
                            className={
                              styles.content__form__fields__users__fields
                            }
                          >
                            <Field
                              name={`users.${index}.username`}
                              placeholder="Имя участника и тег"
                              className={
                                styles.content__form__fields__users__fields__username
                              }
                            />
                            <Field
                              name={`users.${index}.role`}
                              placeholder="Роль"
                              className={
                                styles.content__form__fields__users__fields__role
                              }
                              dropdownItems={roles}
                              component={SelectCustomField}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </FieldArray>
                <Field name="linkToFigma" placeholder="Ссылка на макет Figma" />
              </div>
              <div className={styles.content__form__buttons}>
                <button onClick={closeModal} type="button">
                  Закрыть
                </button>
                <button type="submit">Сохранить</button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export { ModalContent };
