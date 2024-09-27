import React, { FC } from "react";
import styles from "./styles.module.scss";
import { Field, Form, Formik } from "formik";

interface IProps {
  closeModal: () => void;
}

const ModalContent: FC<IProps> = (props) => {
  const { closeModal } = props;

  const initialValues = {
    projectName: "",
    username: "",
    role: "",
    linkToFigma: "",
  };

  const partOfTheFields = [
    { name: "projectName", placeholder: "Название проекта" },
    { name: "username", placeholder: "Имя участника и тег" },
    { name: "role", placeholder: "Роль" },
  ];

  return (
    <div className={styles.content}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => console.log(values)}
      >
        <Form className={styles.content__form}>
          <div className={styles.content__form__fields}>
            {partOfTheFields.map((field) => (
              <Field
                key={field.name}
                name={field.name}
                placeholder={field.placeholder}
              />
            ))}
            <button type="button">Добавить</button>
            <Field name="linkToFigma" placeholder="Ссылка на макет Figma" />
          </div>

          <div className={styles.content__form__buttons}>
            <button onClick={closeModal}>Закрыть</button>
            <button type="submit">Сохранить</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export { ModalContent };
