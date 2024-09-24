"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";

const FontOptions = () => {
    const [showOptions, setShowOptions] = useState(false); // Открытие меню
    const [selectedTag, setSelectedTag] = useState<string | null>(null); // Выбранный заголовок
    const [inputValue, setInputValue] = useState(""); // Текст ввода
    const [savedText, setSavedText] = useState<{ tag: string; text: string; isEditing: boolean }[]>([]); // Сохраненные элементы

    // Обработка выбора заголовка
    const handleOptionClick = (tag: string) => {
        setSelectedTag(tag); // Устанавливаем формат текста (h1, h2, h3)
        setShowOptions(false); // Закрываем меню опций
    };

    // Обработка отправки текста
    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>, index: number | null = null) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            if (index !== null) {
                const updatedText = [...savedText];
                updatedText[index] = { ...updatedText[index], text: inputValue, isEditing: false };
                setSavedText(updatedText);
            } else {
                setSavedText([...savedText, { tag: selectedTag!, text: inputValue, isEditing: false }]);
            }
            setInputValue(""); // Очистка поля ввода
            setSelectedTag(null); // Сброс выбранного заголовка
        }
    };

    // Включение режима редактирования
    const enableEdit = (index: number) => {
        const updatedText = [...savedText];
        updatedText[index].isEditing = true;
        setInputValue(savedText[index].text); // Заполняем поле ввода текущим текстом
        setSavedText(updatedText);
    };

    // Обработка удаления текста
    const handleDelete = (index: number) => {
        setSavedText(savedText.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.fontOptions}>
            <div className={styles.savedTextContainer}>
                {savedText.map((item, index) => {
                    const Tag = item.tag as keyof JSX.IntrinsicElements; // Выбор элемента (h1, h2, h3)
                    return (
                        <div key={index} className={styles.textItem}>
                            {item.isEditing ? (
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => handleSubmit(e, index)}
                                    className={`${styles.inputField} ${styles[item.tag]}`} // Применение стилей для выбранного заголовка
                                    style={{ border: 'none' }} // Убираем обводку
                                />
                            ) : (
                                <>
                                    <Tag
                                        className={styles[item.tag]} // Применяем стили для текущего заголовка (h1, h2, h3)
                                        onClick={() => enableEdit(index)} // Включаем редактирование при клике на текст
                                        style={{ cursor: "pointer" }} // Указатель при наведении
                                    >
                                        {item.text}
                                    </Tag>
                                    <div className={styles.actions}>
                                        <button onClick={() => handleDelete(index)} className={styles.deleteButton}>
                                            Удалить
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {!selectedTag && (
                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className={styles.crossButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.30303 20V0H11.697V20H8.30303ZM0 11.697V8.30303H20V11.697H0Z" fill="#A3A3A3" />
                    </svg>
                </button>
            )}

            {showOptions && (
                <div className={styles.optionsMenu}>
                    <button onClick={() => handleOptionClick("h1")}>Текст h1</button>
                    <button onClick={() => handleOptionClick("h2")}>Текст h2</button>
                    <button onClick={() => handleOptionClick("h3")}>Текст h3</button>
                </div>
            )}

            {selectedTag && (
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => handleSubmit(e)}
                        placeholder={`Введите текст (${selectedTag})`}
                        className={`${styles.inputField} ${selectedTag ? styles[selectedTag] : ''}`} // Применяем стили в зависимости от выбранного заголовка
                        style={{ border: 'none' }} // Убираем обводку
                    />
                </div>
            )}
        </div>
    );
};

export { FontOptions };
