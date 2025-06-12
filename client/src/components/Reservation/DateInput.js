import React from "react";
import { format } from "date-fns";

const DateInput = ({ startDate, endDate, onClick }) => {
  return (
    <input
      type="text"
      readOnly
      value={`${format(startDate, "yyyy-MM-dd")} ~ ${format(endDate, "yyyy-MM-dd")}`}
      onClick={onClick}
      className="date-input"
    />
  );
};

export default DateInput;
