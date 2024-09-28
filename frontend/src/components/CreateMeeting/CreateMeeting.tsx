import React, { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import plusIcon from "@/assets/plus2.svg";
import { useOutsideClick } from "@/utils/hooks/useOutsideClick";
import { Modal } from "../Modal";
import { ModalContent } from "./components/ModalContent";

const CreateMeeting = () => {
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
      <div className={styles.createMeeting} onClick={openModal}>
        <h4>Назначить конференцию</h4>
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

export { CreateMeeting };
