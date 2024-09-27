"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";

import helper from "@/assets/helper.svg";


const Assistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<string[]>([]); // Храним отправленные сообщения


    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            // Добавляем новое сообщение в массив сообщений
            setMessages([...messages, inputValue]);
            setInputValue(""); // Очищаем поле после отправки
        }
    };

    return (
        <div className={styles.assistant}>
            {!isOpen && (
                <button className={styles.assistant__icon} onClick={toggleChat}>
                    <Image src={helper} alt="" />
                </button>
            )}
            {isOpen && (
                <div className={styles.assistant__window}>
                    <div className={styles.assistant__header}>
                        Умный помощник
                        <button className={styles.assistant__header__close} onClick={toggleChat}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M0.89562 2.11899C0.557667 1.78104 0.557666 1.23311 0.89562 0.895151C1.23357 0.557197 1.78151 0.557198 2.11946 0.895151L10.6863 9.46202C11.0243 9.79998 11.0243 10.3479 10.6863 10.6859C10.3484 11.0238 9.80044 11.0238 9.46249 10.6859L0.89562 2.11899Z" fill="white" />
                                <path d="M9.46217 0.895364C9.80013 0.55741 10.3481 0.55741 10.686 0.895364C11.024 1.23332 11.024 1.78125 10.686 2.1192L2.11914 10.6861C1.78119 11.024 1.23326 11.024 0.895301 10.6861C0.557347 10.3481 0.557348 9.80019 0.895302 9.46223L9.46217 0.895364Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                    <div className={styles.assistant__body}>
                        {/* Отображаем сообщения */}
                        {messages.map((message, index) => (
                            <div key={index} className={styles.assistant__message}>
                                {message}
                            </div>
                        ))}
                    </div>
                    <div className={styles.assistant__input}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Введите сообщение..."
                            className={styles.assistant__inputField}
                        />
                        <button className={styles.assistant__sendButton} onClick={handleSend}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <g opacity="0.6">
                                    <path d="M13.3334 7.49998C13.3334 7.55523 13.3177 7.60935 13.2882 7.65602C13.2586 7.7027 13.2164 7.74003 13.1665 7.76365L2.66647 12.722C2.61403 12.7474 2.55515 12.7565 2.49749 12.748C2.43983 12.7395 2.38605 12.7139 2.34314 12.6744C2.30024 12.635 2.27019 12.5836 2.2569 12.5268C2.24362 12.4701 2.24771 12.4106 2.26864 12.3562L3.92647 7.90715C4.02428 7.64451 4.02428 7.35545 3.92647 7.09281L2.26806 2.64373C2.24702 2.58927 2.24287 2.52974 2.25617 2.47289C2.26946 2.41604 2.29957 2.36452 2.34258 2.32504C2.38559 2.28555 2.43949 2.25995 2.49727 2.25155C2.55505 2.24316 2.61401 2.25237 2.66647 2.27798L13.1665 7.23631C13.2164 7.25994 13.2586 7.29726 13.2882 7.34394C13.3177 7.39062 13.3334 7.44473 13.3334 7.49998ZM13.3334 7.49998H3.99997" stroke="#404040" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Assistant };