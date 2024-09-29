"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import frameh1 from "@/assets/frameh1.svg";
import frameh2 from "@/assets/frameh2.svg";
import frameh3 from "@/assets/frameh3.svg";
import frameImg from "@/assets/frameImg.svg";
import frameMark from "@/assets/frameMark.svg";
import frameCheck from "@/assets/frameCheck.svg";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createTextContent, updateTextContent, fetchProjectInfo, deleteTextContent } from "@/store/project/actions";

const FontOptions = ({ projectId }: { projectId: number }) => {
  const dispatch = useAppDispatch();

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
      id?: number;
      order_num?: number;
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    dispatch(fetchProjectInfo(projectId)).then((response) => {
      if (response.payload?.text_content) {
        setSavedText(
          response.payload.text_content.map((item: { content_type: any; content: any; id: any; }) => ({
            tag: item.content_type,
            text: item.content,
            isEditing: false,
            id: item.id,
          }))
        );
      }
    });
  }, [dispatch, projectId]);

  useEffect(() => {
    if ((selectedTag || editIndex !== null) && inputRef.current) {
      inputRef.current.focus();
      adjustTextareaHeight();
      if (inputRef.current instanceof HTMLTextAreaElement) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }
  }, [selectedTag, editIndex]);

  const handleOptionClick = (tag: string) => {
    setSelectedTag(tag);
    setShowOptions(false);
    setInputValue("");
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;

      const newBlock = {
        tag: "Image",
        text: base64String,
        isEditing: false,
        order_num: savedText.length + 1,
      };

      setSavedText([...savedText, newBlock]);

      await dispatch(
        createTextContent({
          projectId,
          content: base64String,
          content_type: "Image",
          order_num: savedText.length + 1,
        })
      );

      setSelectedTag(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        if (editIndex !== null) {
          const updatedText = [...savedText];
          const updatedBlock = {
            ...updatedText[editIndex],
            text: inputValue,
            isEditing: false,
          };
          updatedText[editIndex] = updatedBlock;

          setSavedText(updatedText);
          setEditIndex(null);

          if (updatedBlock.id !== undefined) {
            await dispatch(
              updateTextContent({
                blockId: updatedBlock.id,
                changes: {
                  content: updatedBlock.text!,
                  content_type: updatedBlock.tag,
                  order_num: updatedBlock.order_num!,
                },
              })
            );
          }
        } else {
          const newOrderNum = savedText.length + 1;
          const newBlock = {
            tag: selectedTag!,
            text: inputValue,
            isEditing: false,
            order_num: newOrderNum,
          };
          setSavedText([...savedText, newBlock]);

          await dispatch(
            createTextContent({
              projectId,
              content: newBlock.text!,
              content_type: newBlock.tag,
              order_num: newOrderNum,
            })
          );
        }
      }
      setInputValue("");
      setSelectedTag(null);
    }
  };

  const enableEdit = (index: number) => {
    const item = savedText[index];
    setEditIndex(index);
    setSelectedTag(item.tag);
    setInputValue(item.text || "");
  };

  const handleDelete = async (index: number) => {
    const itemToDelete = savedText[index];
    setSavedText(savedText.filter((_, i) => i !== index));
    if (itemToDelete.id) {
      await dispatch(deleteTextContent({ blockId: itemToDelete.id }));
    }
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={styles.fontOptions}>
      <div className={styles.fontOptions__savedTextContainer}>
        {savedText.map((item, index) => (
          <div key={item.id || index} className={styles.fontOptions__textItem}>
            {editIndex === index ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleSubmit}
                className={`${styles.fontOptions__inputField} ${styles[`fontOptions__${item.tag}`]}`}
                style={{ whiteSpace: "pre-wrap" }}
                rows={1}
              />
            ) : (
              <>
                {item.tag === "CheckboxList" ? (
                  <div className={styles.fontOptions__checkboxItem}>
                    <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    <span onClick={() => enableEdit(index)}>{item.text}</span>
                  </div>
                ) : item.tag === "BulletList" ? (
                  <div className={styles.fontOptions__bulletItem} onClick={() => enableEdit(index)}>
                    <span>• {item.text}</span>
                  </div>
                ) : item.tag === "Image" && item.text ? (
                  <img
                    src={item.text}
                    alt="Изображение"
                    style={{ width: "100%", maxWidth: "600px", marginBottom: "10px" }}
                  />
                ) : (
                  <div
                    className={styles[`fontOptions__${item.tag}`]}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word" }}
                    onClick={() => enableEdit(index)}
                  >
                    {item.text}
                  </div>
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
        ))}
      </div>

      {!selectedTag && editIndex === null && (
        <button onClick={() => setShowOptions(!showOptions)} className={styles.fontOptions__crossButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8.30303 20V0H11.697V20H8.30303ZM0 11.697V8.30303H20V11.697H0Z" fill="#E1E1E1" />
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
            <Image src={frameh1} alt="h1" />
          </button>
          <button onClick={() => handleOptionClick("h2")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Текст h2</p>
              <p>Для того, чтобы начать писать план</p>
            </div>
            <Image src={frameh2} alt="h2" />
          </button>
          <button onClick={() => handleOptionClick("h3")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Текст h3</p>
              <p>Для того, чтобы начать писать план</p>
            </div>
            <Image src={frameh3} alt="h3" />
          </button>
          <button onClick={() => handleOptionClick("Image")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Изображение</p>
              <p>Вставьте изображение в документ</p>
            </div>
            <Image src={frameImg} alt="Image" />
          </button>
          <button onClick={() => handleOptionClick("CheckboxList")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Список с чекбоксами</p>
              <p>Создайте список задач</p>
            </div>
            <Image src={frameCheck} alt="CheckboxList" />
          </button>
          <button onClick={() => handleOptionClick("BulletList")}>
            <div className={styles.fontOptions__optionsMenu__button__info}>
              <p>Маркированный список</p>
              <p>Перечислите элементы</p>
            </div>
            <Image src={frameMark} alt="BulletList" />
          </button>
        </div>
      )}

      {selectedTag === "Image" && (
        <div className={styles.fontOptions__dropZone}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          <p>Нажмите для выбора изображения или перетащите файл сюда</p>
        </div>
      )}

      {selectedTag && editIndex === null && selectedTag !== "Image" && (
        <div>
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleSubmit}
            className={`${styles.fontOptions__inputField} ${styles[`fontOptions__${selectedTag}`]}`}
            rows={1}
            style={{ border: "none", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export { FontOptions };
