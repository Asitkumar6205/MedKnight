import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Define prop types
interface PurpleDatePickerProps {
  label?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  placeholder?: string;
}

interface DateRangeSelectorProps {
  fromDate: string;
  setFromDate: (e: { target: { value: string } }) => void;
  toDate: string;
  setToDate: (e: { target: { value: string } }) => void;
}

// Custom date picker component
const PurpleDatePicker: React.FC<PurpleDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date...",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // Parse and format dates
  const selectedDate = value ? new Date(value) : null;

  // Format date for display in the input
  const formatDateForDisplay = (date: Date): string => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate days of the month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Handle month navigation
  const prevMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Handle date selection
  const handleDateClick = (year: number, month: number, day: number): void => {
    // Create date with time set to noon to avoid timezone issues
    const newDate = new Date(year, month, day, 12, 0, 0);
    const formattedDate = newDate.toISOString().split("T")[0]; // YYYY-MM-DD
    onChange({ target: { value: formattedDate } });
    setIsOpen(false);
  };

  // Render calendar days
  const renderCalendarDays = (): React.ReactNode[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days: React.ReactNode[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const isToday = new Date().toDateString() === date.toDateString();

      const isHovered =
        hoveredDate &&
        date.getDate() === hoveredDate.getDate() &&
        date.getMonth() === hoveredDate.getMonth() &&
        date.getFullYear() === hoveredDate.getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer transition-all duration-200 
            ${
              isSelected
                ? "bg-purple-600 text-white"
                : isHovered
                ? "bg-purple-100"
                : isToday
                ? "border border-purple-300"
                : "hover:bg-purple-50"
            }`}
          onClick={() => handleDateClick(year, month, day)}
          onMouseEnter={() => setHoveredDate(new Date(year, month, day))}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Format month name
  const formatMonth = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Weekday headers
  const weekdays: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative w-full" ref={pickerRef}>
      {label && (
        <label className="block text-sm text-stone-500 mb-1">{label}</label>
      )}

      <div
        className="relative flex items-center border bg-white rounded p-2 cursor-pointer focus-within:ring-2 focus-within:ring-purple-300 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-4 h-4 text-purple-500 mr-2" />
        <input
          type="text"
          readOnly
          className="w-full bg-transparent outline-none cursor-pointer placeholder-stone-400"
          placeholder={placeholder}
          value={selectedDate ? formatDateForDisplay(selectedDate) : ""}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 -left-2 bg-white rounded-lg shadow-lg p-3 border border-stone-200 w-64 animate-in fade-in-50 zoom-in-95 slide-in-from-top-5 duration-200">
          {/* Calendar header */}
          <div className="flex items-center justify-between ">
            <button
              className="p-1 rounded-full hover:bg-purple-100 transition-colors"
              onClick={prevMonth}
              type="button"
            >
              <ChevronLeft className="w-4 h-4 text-purple-700" />
            </button>

            <div className="font-medium text-purple-800">
              {formatMonth(currentMonth)}
            </div>

            <button
              className="p-1 rounded-full hover:bg-purple-100 transition-colors"
              onClick={nextMonth}
              type="button"
            >
              <ChevronRight className="w-4 h-4 text-purple-700" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1">
            {weekdays.map((day) => (
              <div
                key={day}
                className="h-8 w-8 flex items-center justify-center text-xs font-semibold text-purple-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 ">{renderCalendarDays()}</div>

          {/* Quick actions */}
          <div className="pt-2 border-t border-stone-200 flex justify-between">
            <button
              className="text-xs text-purple-600 hover:text-purple-800 font-medium"
              onClick={() => {
                const today = new Date();
                const formattedDate = today.toISOString().split("T")[0];
                onChange({ target: { value: formattedDate } });
                setIsOpen(false);
              }}
              type="button"
            >
              Today
            </button>

            <button
              className="text-xs text-stone-500 hover:text-stone-700 font-medium"
              onClick={() => {
                onChange({ target: { value: "" } });
                setIsOpen(false);
              }}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage in your component
const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  return (
    <div className="flex flex-row max-sm:flex-col gap-4">
      <div className="w-full md:w-auto">
        <PurpleDatePicker
          value={fromDate}
          onChange={setFromDate}
          placeholder="Select start date..."
        />
      </div>
      <div className="w-full md:w-auto">
        <PurpleDatePicker
          value={toDate}
          onChange={setToDate}
          placeholder="Select end date..."
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;
