import React, { FC } from "react";
import styles from "./styles.module.scss";
import { Field, Form, Formik } from "formik";
import { CustomMaskField } from "@/components/CustomMaskField";

interface IProps {
  closeModal: () => void;
}

const ModalContent: FC<IProps> = (props) => {
  const { closeModal } = props;

  const initialValues = {
    projectName: "",
    data: "",
    linkToZoom: "",
  };

  return (
    <div className={styles.content}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => console.log(values)}
      >
        {() => {
          return (
            <Form className={styles.content__form}>
              <div className={styles.content__form__fields}>
                <Field name="projectName" placeholder="Название проекта" />
                <Field name="data" component={CustomMaskField} />
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
