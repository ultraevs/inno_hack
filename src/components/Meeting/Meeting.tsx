import React, { FC } from "react";
import styles from "./styles.module.scss";

interface IProps {
  readonly projectName: string;
  readonly date: string;
  readonly images: string[];
  readonly link: string;
}

const months = [
  "янв", "фев", "мар", "апр", "май", "июн",
  "июл", "авг", "сент", "окт", "нояб", "дек"
];

const formatDate = (dateString: string): string => {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
};

const Meeting: FC<IProps> = (props) => {
  const { projectName, date, images, link } = props;

  return (
    <div className={styles.meeting}>
      <div className={styles.meeting__mainInfo}>
        <div className={styles.meeting__mainInfo__text}>
          <p className={styles.meeting__mainInfo__text__title}>Созвон с командой</p>
          <p className={styles.meeting__mainInfo__text__projectName}>{projectName}</p>
        </div>
        <div className={styles.meeting__mainInfo__date}>
          <p>{formatDate(date)}</p>
        </div>
      </div>

      <div className={styles.meeting__moreInfo}>
        <div className={styles.meeting__moreInfo__imagesContainer}>
          {images.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`icon-${index}`} 
              className={styles.meeting__moreInfo__imagesContainer__imageIcon} 
            />
          ))}
        </div>
        <a href={link}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="4" fill="black" />
            <path d="M8.75 8.75H21.25M21.25 8.75V21.25M21.25 8.75L8.75 21.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export { Meeting };
