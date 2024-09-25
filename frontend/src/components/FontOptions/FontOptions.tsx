"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.scss";

const FontOptions = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [savedText, setSavedText] = useState<{ tag: string; text: string; isEditing: boolean }[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null); // Текущий индекс для редактирования
    const inputRef = useRef<HTMLTextAreaElement | null>(null); // Референс для поля ввода

    // Фокусировка на поле ввода, когда выбран заголовок или идет редактирование
    useEffect(() => {
        if ((selectedTag || editIndex !== null) && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedTag, editIndex]);

    // Автоматическое изменение высоты textarea
    const autoResizeTextarea = () => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto"; // Сбрасываем высоту, чтобы корректно пересчитать
            inputRef.current.style.height = inputRef.current.scrollHeight + "px"; // Устанавливаем высоту по содержимому
        }
    };

    // Обработка выбора заголовка
    const handleOptionClick = (tag: string) => {
        setSelectedTag(tag);
        setShowOptions(false);
        setInputValue(""); // Очищаем поле ввода при выборе нового заголовка
    };

    // Обработка нажатия клавиш
    const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Добавление новой строки при нажатии Shift + Enter
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setInputValue((prev) => prev + "\n"); // Добавляем перенос строки в текст
            return;
        }

        // Добавление текста при нажатии Enter без Shift
        if (e.key === "Enter" && !e.shiftKey && inputValue.trim() !== "") {
            e.preventDefault();
            if (editIndex !== null) {
                const updatedText = [...savedText];
                updatedText[editIndex] = { ...updatedText[editIndex], text: inputValue, isEditing: false };
                setSavedText(updatedText);
                setEditIndex(null);
            } else {
                setSavedText([...savedText, { tag: selectedTag!, text: inputValue, isEditing: false }]);
            }
            setInputValue("");
            setSelectedTag(null);
        }
    };

    // Удаление строки при нажатии Backspace или Delete, если она пустая
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
        if ((e.key === "Backspace" || e.key === "Delete") && inputValue === "") {
            const updatedText = [...savedText];
            updatedText.splice(index, 1); // Удаляем строку
            setSavedText(updatedText);
            if (updatedText.length === 0) {
                setEditIndex(null);
                setSelectedTag(null);
            } else if (index > 0) {
                enableEdit(index - 1); // Возвращаем фокус на предыдущую строку
            }
        }
    };

    // Включение режима редактирования
    const enableEdit = (index: number) => {
        const item = savedText[index];
        setEditIndex(index); // Устанавливаем индекс редактируемого элемента
        setInputValue(item.text); // Подставляем текст для редактирования
        setSelectedTag(item.tag); // Подставляем формат заголовка
    };

    const handleDelete = (index: number) => {
        setSavedText(savedText.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.fontOptions}>
            <div className={styles.fontOptions__savedTextContainer}>
                {savedText.map((item, index) => {
                    const Tag = item.tag as keyof JSX.IntrinsicElements;
                    return (
                        <div key={index} className={styles.fontOptions__textItem}>
                            {editIndex === index ? (
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        handleKeyDown(e, index);
                                        handleSubmit(e);
                                    }}
                                    className={`${styles.fontOptions__inputField} ${styles[`fontOptions__${item.tag}`]}`}
                                    style={{ whiteSpace: "pre-wrap" }} // Отображаем текст с переносами строк
                                />
                            ) : (
                                <>
                                    <Tag
                                        className={styles[`fontOptions__${item.tag}`]}
                                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word" }} // Обязательно для переноса
                                        onClick={() => enableEdit(index)}
                                    >
                                        {item.text}
                                    </Tag>

                                    <div className={styles.fontOptions__actions}>
                                        <button onClick={() => handleDelete(index)} className={styles.fontOptions__deleteButton}>
                                            Удалить
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {!selectedTag && editIndex === null && (
                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className={styles.fontOptions__crossButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.30303 20V0H11.697V20H8.30303ZM0 11.697V8.30303H20V11.697H0Z" fill="#A3A3A3" />
                    </svg>
                </button>
            )}

            {showOptions && (
                <div className={styles.fontOptions__optionsMenu}>
                    <button onClick={() => handleOptionClick("h1")}>Текст h1</button>
                    <button onClick={() => handleOptionClick("h2")}>Текст h2</button>
                    <button onClick={() => handleOptionClick("h3")}>Текст h3</button>
                </div>
            )}

            {selectedTag && editIndex === null && (
                <div>
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            autoResizeTextarea();
                        }}
                        onKeyDown={handleSubmit}
                        className={`${styles.fontOptions__inputField} ${styles[`fontOptions__${selectedTag}`]}`}
                        rows={1}
                    />

                </div>
            )}
        </div>
    );
};

export { FontOptions };
