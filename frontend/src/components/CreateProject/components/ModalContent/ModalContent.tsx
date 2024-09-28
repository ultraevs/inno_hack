import React, { FC } from "react";
import styles from "./styles.module.scss";
import { Field, FieldArray, Form, Formik } from "formik";
import { SelectCustomField } from "@/components/SelectCustomField";
import { useAppDispatch } from "@/store/hooks";
import { createProject } from "@/store/profile/actions";

interface IProps {
  closeModal: () => void;
}

const ModalContent: FC<IProps> = (props) => {
  const { closeModal } = props;

  const dispatch = useAppDispatch();

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

  return (
    <div className={styles.content}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) =>
          dispatch(createProject(values))
            .unwrap()
            .then((data) => {
              if (data.success) {
                closeModal()
              }
            })
        }
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
                  {({ push }) => (
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
                            {values.users.length - 1 === index && (
                              <button
                                type="button"
                                onClick={() => push({ username: "", role: "" })}
                              >
                                +
                              </button>
                            )}
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
