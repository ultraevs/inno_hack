import React, { FC, useEffect } from "react";
import styles from "./styles.module.scss";
import { Field, FieldArray, Form, Formik } from "formik";
import { SelectCustomField } from "@/components/SelectCustomField";

interface IProps {
  closeModal: () => void;
}

const ModalContent: FC<IProps> = (props) => {
  const { closeModal } = props;

  const initialValues = {
    projectName: "",
    users: [{ username: "", role: "" }],
    linkToFigma: "",
  };

  const roles = [
    "Project Manager",
    "Machine Learning",
    "Computer Vision",
    "Frontend",
    "Backend",
    "Dev-Ops",
    "Designer",
    "Full-Stack"
];

  return (
    <div className={styles.content}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => console.log(values)}
      >
        {({ values, setFieldValue }) => {
          useEffect(() => {
            const lastIndex = values.users.length - 1;
            const lastUser = values.users[lastIndex];

            if (lastUser.username !== "" && lastUser.role !== "") {
              setFieldValue(`users.${lastIndex + 1}`, {
                username: "",
                role: "",
              });
            }
          }, [values.users]);

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
