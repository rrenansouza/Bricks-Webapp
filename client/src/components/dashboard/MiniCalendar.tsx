import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  highlightedDates?: Date[];
  className?: string;
}

export function MiniCalendar({
  selectedDate,
  onDateSelect,
  highlightedDates = [],
  className = "",
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const isHighlighted = (date: Date) => {
    return highlightedDates.some((d) => isSameDay(d, date));
  };

  return (
    <div className={className} data-testid="mini-calendar">
      <div className="flex items-center justify-between gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          data-testid="button-prev-month"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium text-sm">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          data-testid="button-next-month"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const hasEvent = isHighlighted(day);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              disabled={!isCurrentMonth}
              className={`
                relative w-8 h-8 rounded-md text-sm flex items-center justify-center
                transition-colors
                ${!isCurrentMonth ? "text-muted-foreground/30" : ""}
                ${isSelected ? "bg-primary text-primary-foreground font-medium" : ""}
                ${!isSelected && isToday ? "bg-muted text-foreground" : ""}
                ${!isSelected && isCurrentMonth ? "hover:bg-muted/50" : ""}
              `}
              data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
            >
              {format(day, "d")}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
