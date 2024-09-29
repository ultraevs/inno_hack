"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import cn from "classnames";
import helper from "@/assets/helper.svg";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendAnswer, sendMessage } from "@/store/chat/actions";
import { getCookie } from "cookies-next";
import { addMessage } from "@/store/chat/chatSlice";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";

const Assistant: React.FC = () => {
  const dispatch = useAppDispatch();

  const Authtoken = getCookie("Authtoken") || "";

  const messages = useAppSelector((store) => store.chat.messages);
  const secretValue = useAppSelector((store) => store.chat.secretValue);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    dispatch(addMessage({ text: inputValue }));
    dispatch(sendMessage({ user_text: inputValue, Authtoken }));
    setInputValue("");
  };

  const handleAnswer = (bool: boolean) => {
    dispatch(sendAnswer({secret: secretValue, answer: bool, Authtoken}))
  }

  return (
    <div className={styles.assistant}>
      {!isOpen && (
        <button className={styles.assistant__icon} onClick={toggleChat}>
          <Image src={helper} alt="btn" />
        </button>
      )}
      {isOpen && (
        <div className={styles.assistant__window}>
          <div className={styles.assistant__header}>
            <p>Умный помощник</p>
            <button
              className={styles.assistant__header__close}
              onClick={toggleChat}
            >
              <CloseOutlined />
            </button>
          </div>
          <div className={styles.assistant__body}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  styles.assistant__message,
                  message.hasOwnProperty("buttons") && styles.generated,
                )}
              >
                <div className={styles.assistant__message__block}>
                  <p>{message.text}</p>
                </div>
                {message.buttons && (
                  <div className={styles.assistant__message__btns}>
                    <button onClick={() => handleAnswer(true)}>Да</button>
                    <button onClick={() => handleAnswer(false)}>Нет</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.assistant__input}>
            <div className={styles.assistant__input__container}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Введите сообщение..."
                className={styles.assistant__inputField}
              />
              <button
                className={styles.assistant__sendButton}
                onClick={handleSend}
              >
                <SendOutlined />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Assistant };
