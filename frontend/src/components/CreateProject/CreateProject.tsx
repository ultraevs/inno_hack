"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import plusIcon from "@/assets/plus.svg";
import { Modal } from "../Modal";
import { ModalContent } from "./components/ModalContent";
import { useOutsideClick } from "@/utils/hooks/useOutsideClick";

const CreateProject = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalRef = useOutsideClick({ callback: closeModal });

  return (
    <>
      <div className={styles.createProject} onClick={openModal}>
        <h4>Создать проект</h4>
        <button>
          <Image src={plusIcon} alt="plus icon" />
        </button>
      </div>
      <Modal isModalOpen={isModalOpen} modalRef={modalRef}>
        <ModalContent closeModal={closeModal} />
      </Modal>
    </>
  );
};

export { CreateProject };
