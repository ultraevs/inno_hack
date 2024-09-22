"use client";

import React from "react";
import "./styles.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";

const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const Calendar = () => {
  dayjs.locale("ru");

  const dayOfWeekFormatter = (date: Dayjs) => {
    return dayNames[date.day()];
  };

  const today: Dayjs = dayjs();

  const formatDate = (date: Dayjs) => {
    const month = date.format("MMMM");
    const capitalizedMonth =
      month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    return `${dayOfWeekFormatter(date)}, ${capitalizedMonth} ${date.date()}`;
  };

  return (
    <div className="calendar">
      <div className="calendar__title">
        <p>календарь</p>
        <h4>{formatDate(today)}</h4>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          dayOfWeekFormatter={dayOfWeekFormatter}
          defaultValue={today}
          className="calendar__component"
        />
      </LocalizationProvider>
    </div>
  );
};

export { Calendar };
