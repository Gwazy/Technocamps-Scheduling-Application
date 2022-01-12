import React, { useState } from "react";
import DatePicker from "react-datepicker";

//  Needs work
//  const years = range(initalDate.getFullYear(), initalDate.getFullYear() + 1);
const isWeekday = (date) => {
  const day = date.getDay();

  return day !== 0 && day !== 6;
};

const CalenderPicker = (props) => {
  let miniDate = props.sharedDateObj.constantInitialDate;

  const dateChangeEvent = (date) => {
    props.setDate(date);
  };

  return (
    <div>
      {/* Usage of the Calender componet */}
      <DatePicker
        className="calenderColour"
        dateFormat="dd/MM/yyyy"
        onChange={(date) => dateChangeEvent(date)}
        minDate={miniDate}
        selected={props.sharedDateObj.currentDate}
        showMonthDropdown
        filterDate={isWeekday}
        inline
      />
    </div>
  );
};

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

export default CalenderPicker;
