"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import frameh1 from "@/assets/frameh1.svg"
import frameh2 from "@/assets/frameh2.svg"
import frameh3 from "@/assets/frameh3.svg"
import frameImg from "@/assets/frameImg.svg";
import frameMark from "@/assets/frameMark.svg"
import frameCheck from "@/assets/frameCheck.svg"


const FontOptions = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [savedText, setSavedText] = useState<
    {
      tag: string;
      text?: string;
      imageSrc?: string;
      isEditing: boolean;
      width?: number;
      height?: number;
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Состояние для Drag and Drop
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    if ((selectedTag || editIndex !== null) && inputRef.current) {
      inputRef.current.focus();
      if (
        (inputRef.current instanceof HTMLTextAreaElement ||
          inputRef.current instanceof HTMLInputElement) &&
        inputRef.current.type !== "file"
      ) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }
  }, [selectedTag, editIndex]);

  const autoResizeTextarea = () => {
    if (inputRef.current && inputRef.current instanceof HTMLTextAreaElement) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  const handleOptionClick = (tag: string) => {
    setSelectedTag(tag);
    setShowOptions(false);
    setInputValue("");
  };

  const handleSubmit = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInputValue((prev) => prev + "\n");
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        if (editIndex !== null) {
          const updatedText = [...savedText];
          updatedText[editIndex] = {
            ...updatedText[editIndex],
            text: inputValue,
            isEditing: false,
          };
          setSavedText(updatedText);
          setEditIndex(null);
        } else {
          setSavedText([
            ...savedText,
            { tag: selectedTag!, text: inputValue, isEditing: false },
          ]);
        }
      }
      setInputValue("");
      setSelectedTag(null);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    if ((e.key === "Backspace" || e.key === "Delete") && inputValue === "") {
      const updatedText = [...savedText];
      updatedText.splice(index, 1);
      setSavedText(updatedText);
      if (updatedText.length === 0) {
        setEditIndex(null);
        setSelectedTag(null);
      } else if (index > 0) {
        enableEdit(index - 1);
      }
    }
  };

  const enableEdit = (index: number) => {
    const item = savedText[index];
    setEditIndex(index);
    setSelectedTag(item.tag);
    if (item.tag === "Image") {
      // Изображение не редактируется
    } else {
      setInputValue(item.text || "");
    }
  };

  const handleDelete = (index: number) => {
    setSavedText(savedText.filter((_, i) => i !== index));
  };

  // Обработка загрузки изображения через input или drag-and-drop
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      const img = new window.Image();
      img.src = imageSrc;
      img.onload = () => {
        let { naturalWidth: width, naturalHeight: height } = img;
        if (width > 600 || height > 300) {
          width = width / 2;
          height = height / 2;
        }
        setSavedText([
          ...savedText,
          {
            tag: "Image",
            imageSrc,
            isEditing: false,
            width,
            height,
          },
        ]);
        setSelectedTag(null);
      };
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  return (
    <div className={styles.fontOptions}>
      <div className={styles.fontOptions__savedTextContainer}>
        {savedText.map((item, index) => {
          const Tag = item.tag as keyof JSX.IntrinsicElements;
          return (
            <div key={index} className={styles.fontOptions__textItem}>
              {editIndex === index ? (
                item.tag === "Image" ? (
                  // Изображения не редактируются
                  <img
                    src={item.imageSrc}
                    alt=""
                    style={{
                      width: item.width ? item.width : "auto",
                      height: item.height ? item.height : "auto",
                      maxWidth: "100%",
                    }}
                  />
                ) : (
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index);
                      handleSubmit(e);
                    }}
                    className={`${styles.fontOptions__inputField} ${styles[`fontOptions__${item.tag}`]
                      }`}
                    style={{ whiteSpace: "pre-wrap" }}
                    rows={1}
                  />
                )
              ) : (
                <>
                  {item.tag === "Image" ? (
                    <img
                      src={item.imageSrc}
                      alt=""
                      style={{
                        width: item.width ? item.width : "auto",
                        height: item.height ? item.height : "auto",
                        maxWidth: "100%",
                      }}
                    />
                  ) : item.tag === "CheckboxList" ? (
                    <div className={styles.fontOptions__checkboxItem}>
                      <input
                        type="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span onClick={() => enableEdit(index)}>
                        {item.text}
                      </span>
                    </div>

                  ) : item.tag === "BulletList" ? (
                    <div
                      className={styles.fontOptions__bulletItem}
                      onClick={() => enableEdit(index)}
                    >
                      <span>• {item.text}</span>
                    </div>
                  ) : (
                    <Tag
                      className={styles[`fontOptions__${item.tag}`]}
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                      onClick={() => enableEdit(index)}
                    >
                      {item.text}
                    </Tag>
                  )}
                  <div className={styles.fontOptions__actions}>
                    <button
                      onClick={() => handleDelete(index)}
                      className={styles.fontOptions__deleteButton}
                    >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M8.30303 20V0H11.697V20H8.30303ZM0 11.697V8.30303H20V11.697H0Z"
              fill="#E1E1E1"
            />
          </svg>
        </button>
      )}

      {showOptions && (
        <div className={styles.fontOptions__optionsMenu}>
          <button onClick={() => handleOptionClick("h1")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Текст h1</p>
              <p>Для того, чтобы начать писать план</p>
            </div>
            <Image src={frameh1} alt="" />
          </button>
          <button onClick={() => handleOptionClick("h2")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Текст h2</p>
              <p>Для того, чтобы начать писать план</p>
            </div>
            <Image src={frameh2} alt="" />
          </button>
          <button onClick={() => handleOptionClick("h3")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Текст h3</p>
              <p>Для того, чтобы начать писать план</p>
            </div>
            <Image src={frameh3} alt="" />
          </button>
          <button onClick={() => handleOptionClick("Image")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Изображение</p>
              <p>Вставьте изображение в документ</p>
            </div>
            <Image src={frameImg} alt="" />
          </button>
          <button onClick={() => handleOptionClick("CheckboxList")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Список с чекбоксами</p>
              <p>Создайте список задач</p>
            </div>
            <Image src={frameCheck} alt="" />
          </button>
          <button onClick={() => handleOptionClick("BulletList")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Маркированный список</p>
              <p>Перечислите элементы</p>
            </div>
            <Image src={frameMark} alt="" />
          </button>
        </div>
      )}

      {selectedTag && editIndex === null && (
        <div>
          {selectedTag === "Image" ? (
            <div
              className={`${styles.fontOptions__dropZone} ${isDraggingOver ? styles.fontOptions__dropZoneActive : ""
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.click();
                }
              }}
            >
              <p>Перетащите изображение сюда или нажмите для выбора файла</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className={styles.fontOptions__fileInput}
                ref={inputRef as React.RefObject<HTMLInputElement>}
              />
            </div>
          ) : (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                autoResizeTextarea();
              }}
              onKeyDown={handleSubmit}
              className={`${styles.fontOptions__inputField} ${styles[`fontOptions__${selectedTag}`]
                }`}
              rows={1}
              style={{ border: "none" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export { FontOptions };
