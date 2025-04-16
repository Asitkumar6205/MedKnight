import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronsUp, ChevronsDown } from "lucide-react";

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
  const [yearSelectMode, setYearSelectMode] = useState<boolean>(false);
  const [yearListStartIndex, setYearListStartIndex] = useState<number>(0);
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

  // Initialize the year list based on current year
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
    
    const currentYear = currentMonth.getFullYear();
    setYearListStartIndex(Math.floor(currentYear / 16) * 16);
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setYearSelectMode(false);
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

  // Year list navigation
  const showPreviousYears = (): void => {
    setYearListStartIndex(yearListStartIndex - 16);
  };

  const showNextYears = (): void => {
    setYearListStartIndex(yearListStartIndex + 16);
  };

  // Handle date selection
  const handleDateClick = (year: number, month: number, day: number): void => {
    // Create date with time set to noon to avoid timezone issues
    const newDate = new Date(year, month, day, 12, 0, 0);
    const formattedDate = newDate.toISOString().split("T")[0]; // YYYY-MM-DD
    onChange({ target: { value: formattedDate } });
    setIsOpen(false);
  };

  // Handle year selection
  const handleYearClick = (year: number): void => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setYearSelectMode(false);
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

  // Render year selector
  const renderYearSelector = (): React.ReactNode => {
    const years = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 16; i++) {
      const year = yearListStartIndex + i;
      const isCurrentYear = year === currentYear;
      const isSelected = year === currentMonth.getFullYear();
      
      years.push(
        <div
          key={`year-${year}`}
          className={`flex items-center text-xs justify-center h-8 w-12 rounded cursor-pointer transition-all duration-200
            ${
              isSelected
                ? "bg-purple-600 text-white"
                : isCurrentYear
                ? "border border-purple-300"
                : "hover:bg-purple-50"
            }`}
          onClick={() => handleYearClick(year)}
        >
          {year}
        </div>
      );
    }
    
    return (
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <button
            className="p-1 rounded-full hover:bg-purple-100 transition-colors"
            onClick={showPreviousYears}
            type="button"
          >
            <ChevronsUp className="w-4 h-4 text-purple-700" />
          </button>

          <div className="text-sm text-purple-800">
            {yearListStartIndex} - {yearListStartIndex + 15}
          </div>

          <button
            className="p-1 rounded-full hover:bg-purple-100 transition-colors"
            onClick={showNextYears}
            type="button"
          >
            <ChevronsDown className="w-4 h-4 text-purple-700" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {years}
        </div>
        
        <div className="mt-2 flex justify-end">
          <button
            className="text-xs text-purple-600 hover:text-purple-800 font-medium"
            onClick={() => setYearSelectMode(false)}
            type="button"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
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
        className="relative flex items-center border bg-white rounded py-1 px-2 cursor-pointer focus-within:ring-2 focus-within:ring-purple-300 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-4 h-4 text-purple-500 mr-2" />
        <input
          type="text"
          readOnly
          className="w-full bg-transparent outline-none cursor-pointer placeholder:text-sm placeholder-stone-400"
          placeholder={placeholder}
          value={selectedDate ? formatDateForDisplay(selectedDate) : ""}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 -left-2 bg-white rounded-lg shadow-lg p-3 border border-stone-200 w-64 animate-in fade-in-50 zoom-in-95 slide-in-from-top-5 duration-200">
          {yearSelectMode ? (
            renderYearSelector()
          ) : (
            <>
              {/* Calendar header */}
              <div className="flex items-center justify-between">
                <button
                  className="p-1 rounded-full hover:bg-purple-100 transition-colors"
                  onClick={prevMonth}
                  type="button"
                >
                  <ChevronLeft className="w-4 h-4 text-purple-700" />
                </button>

                <button
                  className="font-medium text-purple-800 text-sm hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                  onClick={() => setYearSelectMode(true)}
                  type="button"
                >
                  {formatMonth(currentMonth)}
                </button>

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
              <div className="grid grid-cols-7 text-xs">{renderCalendarDays()}</div>

              {/* Quick actions */}
              <div className="pt-2 border-t border-stone-200 flex justify-between ">
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
            </>
          )}
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
    <div className="flex flex-row max-sm:flex-col gap-2">
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