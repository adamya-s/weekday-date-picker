import React from "react";
import "./App.css";
import WeekdayDateRangePicker from "./components/WeekdayDateRangePicker";

const App: React.FC = () => {
  const predefinedRanges = [
    {
      label: 'Last 7 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        return { start, end };
      }
    },
    {
      label: 'Last 30 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return { start, end };
      }
    }
  ];

  const handleRangeChange = (range: { start: Date | null, end: Date | null }, weekends: Date[]) => {
    console.log('Selected range:', range);
    console.log('Weekends in range:', weekends);
  };

  return (
    <>
      <div>
        <h1>Date Range Picker (Weekday)</h1>
        <WeekdayDateRangePicker 
          predefinedRanges={predefinedRanges}
          onRangeChange={handleRangeChange}
        />
      </div>
    </>
  );
}

export default App;
