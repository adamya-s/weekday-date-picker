import React, { useState, useCallback } from "react";
import {
  daysInMonth,
  firstDayOfMonth,
  isWeekend,
  isWeekday,
  getWeekendsInRange,
  formatDate,
} from "../utils/dateUtils";
import "./WeekdayDateRangePicker.css";
interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface PredefinedRange {
  label: string;
  getValue: () => DateRange;
}

interface WeekdayDateRangePickerProps {
  predefinedRanges?: PredefinedRange[];
  onRangeChange?: (range: DateRange, weekends: Date[]) => void;
}

const WeekdayDateRangePicker: React.FC<WeekdayDateRangePickerProps> = ({
  predefinedRanges,
  onRangeChange,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isWeekend(date)) return;

      setDateRange((prev) => {
        let newRange: DateRange;
        if (!prev.start || (prev.start && prev.end)) {
          newRange = { start: date, end: null };
        } else {
          newRange =
            date < prev.start
              ? { start: date, end: prev.start }
              : { start: prev.start, end: date };
        }

        if (newRange.start && newRange.end) {
          const weekends = getWeekendsInRange(newRange);
          onRangeChange && onRangeChange(newRange, weekends);
        }

        return newRange;
      });
    },
    [onRangeChange]
  );

  const renderCalendar = () => {
    const days: JSX.Element[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected =
        dateRange.start &&
        dateRange.end &&
        date >= dateRange.start &&
        date <= dateRange.end &&
        isWeekday(date);
      const isStart =
        dateRange.start && date.getTime() === dateRange.start.getTime();
      const isEnd = dateRange.end && date.getTime() === dateRange.end.getTime();
      const isWeekendDay = isWeekend(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`calendar-day
            ${isSelected ? "selected" : ""}
            ${isStart ? "start" : ""}
            ${isEnd ? "end" : ""}
            ${isWeekendDay ? "weekend" : ""}
          `}
          disabled={isWeekendDay}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1)
    );
  };

  const changeYear = (increment: number) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear() + increment, prev.getMonth(), 1)
    );
  };

  const handlePredefinedRange = (range: PredefinedRange) => {
    const newRange = range.getValue();
    setDateRange(newRange);
    if (newRange.start && newRange.end) {
      const weekends = getWeekendsInRange(newRange);
      onRangeChange && onRangeChange(newRange, weekends);
    }
  };

  return (
    <div className="date-range-picker">
      <div className="calendar-header">
        <button onClick={() => changeYear(-1)} className="year-nav">
          &lt;&lt;
        </button>
        <button onClick={() => changeMonth(-1)} className="month-nav">
          &lt;
        </button>
        <h2>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => changeMonth(1)} className="month-nav">
          &gt;
        </button>
        <button onClick={() => changeYear(1)} className="year-nav">
          &gt;&gt;
        </button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
      <div className="selected-range">
        <p>
          Start: <span className="date">{formatDate(dateRange.start)}</span>
        </p>
        <p>
          End: <span className="date">{formatDate(dateRange.end)}</span>
        </p>
      </div>
      {predefinedRanges && (
        <div className="predefined-ranges">
          {predefinedRanges.map((range, index) => (
            <button
              className="predefined-buttons"
              key={index}
              onClick={() => handlePredefinedRange(range)}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekdayDateRangePicker;
