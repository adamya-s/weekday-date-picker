import React, { useState, useCallback } from 'react';
import {
  daysInMonth,
  firstDayOfMonth,
  isWeekend,
  isWeekday,
  getWeekendsInRange,
  formatDate,
} from '../utils/dateUtils';
import ErrorMessage from './error/ErrorMessage';
import './WeekdayDateRangePicker.css';

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
  const [error, setError] = useState<string | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // Updated keyboard navigation handler

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isWeekend(date)) {
        setError('Weekend dates cannot be selected');
        return;
      }

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
      setError(null);
    },
    [onRangeChange]
  );
  const handleKeyboardNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();

      if (!focusedDate) {
        setFocusedDate(new Date(currentMonth));
        return;
      }

      const newDate = new Date(focusedDate);

      switch (e.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'Enter':
        case ' ': // Space key
          if (!isWeekend(newDate)) {
            handleDateClick(newDate);
          }
          break;
        default:
          return;
      }

      // Update the current month if the focused date changes months
      if (newDate.getMonth() !== currentMonth.getMonth()) {
        setCurrentMonth(newDate);
      }

      setFocusedDate(newDate);
    },
    [focusedDate, currentMonth, handleDateClick]
  );

  // Update the calendar day rendering to include keyboard focus
  const renderCalendar = () => {
    const days: JSX.Element[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className='calendar-day empty'></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      // Reset hours, minutes, seconds, and milliseconds for accurate date comparison
      date.setHours(0, 0, 0, 0);
      const startDate = dateRange.start
        ? new Date(dateRange.start.setHours(0, 0, 0, 0))
        : null;
      const endDate = dateRange.end
        ? new Date(dateRange.end.setHours(0, 0, 0, 0))
        : null;

      const isSelected =
        startDate &&
        endDate &&
        date >= startDate &&
        date <= endDate &&
        isWeekday(date);
      // dateRange.start &&
      // dateRange.end &&
      // date >= dateRange.start &&
      // date <= dateRange.end &&
      //isWeekday(date);
      const isStart =
        dateRange.start && date.getTime() === dateRange.start.getTime();
      const isEnd = dateRange.end && date.getTime() === dateRange.end.getTime();
      const isWeekendDay = isWeekend(date);
      const isFocused = focusedDate && date.getTime() === focusedDate.getTime();
      const isToday = date.getTime() === today.getTime();
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onFocus={() => setFocusedDate(date)}
          className={`calendar-day
            ${isSelected ? 'selected' : ''}
            ${isStart ? 'start' : ''}
            ${isEnd ? 'end' : ''}
            ${isWeekendDay ? 'weekend' : ''}
            ${isFocused ? 'focused' : ''}
            ${isToday ? 'today' : ''}
          `}
          disabled={isWeekendDay}
          tabIndex={isFocused ? 0 : -1}
          aria-label={`${date.toLocaleDateString()} ${
            isWeekendDay ? '(weekend)' : ''
          }${isToday ? '(today)' : ''}`}
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
    <div
      className='date-range-picker'
      role='application'
      aria-label='Date Range Picker'
    >
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <div className='calendar-header'>
        <button
          onClick={() => changeYear(-1)}
          className='year-nav'
          aria-label='Previous year'
        >
          &lt;&lt;
        </button>
        <button
          onClick={() => changeMonth(-1)}
          className='month-nav'
          aria-label='Previous month'
        >
          &lt;
        </button>
        <h2 id='current-month'>
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className='month-nav'
          aria-label='Next month'
        >
          &gt;
        </button>
        <button
          onClick={() => changeYear(1)}
          className='year-nav'
          aria-label='Next year'
        >
          &gt;&gt;
        </button>
      </div>
      <div
        className='calendar-grid'
        role='grid'
        aria-labelledby='current-month'
        onKeyDown={handleKeyboardNavigation}
        tabIndex={0}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className='day-header' role='columnheader'>
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
      <div className='selected-range'>
        <p>
          Start: <span className='date'>{formatDate(dateRange.start)}</span>
        </p>
        <p>
          End: <span className='date'>{formatDate(dateRange.end)}</span>
        </p>
      </div>
      {predefinedRanges && (
        <div className='predefined-ranges'>
          {predefinedRanges.map((range, index) => (
            <button
              className='predefined-buttons'
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
