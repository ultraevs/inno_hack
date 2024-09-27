import React, { FC, RefObject, useEffect } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";

interface Props {
  readonly isModalOpen: boolean;
  readonly modalRef: RefObject<HTMLInputElement>;
  readonly children: React.ReactNode;
}

const Modal: FC<Props> = (props) => {
  const { isModalOpen, modalRef, children } = props;
  
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    } else {
      document.body.classList.remove("lock-scroll");
    }

    return () => {
      document.body.classList.remove("lock-scroll");
    };
  }, [isModalOpen]);

  return (
    <section
      className={isModalOpen ? cn(styles.modal, styles.active) : styles.modal}
    >
      <div ref={modalRef} className={styles.modal__content}>
        {children}
      </div>
    </section>
  );
};

export { Modal };
