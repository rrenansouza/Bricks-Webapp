import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleEvent {
  id: string;
  startTime: Date;
  endTime: Date;
  title: string;
  type: "appointment" | "personal_event";
  color?: string;
}

interface WeeklyScheduleProps {
  events: ScheduleEvent[];
  selectedDate: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function WeeklySchedule({
  events,
  selectedDate,
  onDateSelect,
  className = "",
}: WeeklyScheduleProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), day));
  };

  return (
    <div className={className} data-testid="weekly-schedule">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={index}
              onClick={() => onDateSelect?.(day)}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-colors
                ${isSelected ? "bg-primary/20" : ""}
                ${isToday && !isSelected ? "bg-muted/50" : ""}
                ${!isSelected && !isToday ? "hover:bg-muted/30" : ""}
              `}
              data-testid={`week-day-${format(day, 'yyyy-MM-dd')}`}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {format(day, "EEE", { locale: ptBR })}
              </span>
              <span
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isToday ? "bg-primary text-primary-foreground" : ""}
                `}
              >
                {format(day, "d")}
              </span>
              <div className="flex gap-1 mt-2 min-h-[6px]">
                {dayEvents.slice(0, 3).map((event, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        event.type === "appointment"
                          ? "hsl(75, 100%, 50%)"
                          : event.color || "hsl(173, 80%, 50%)",
                    }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
