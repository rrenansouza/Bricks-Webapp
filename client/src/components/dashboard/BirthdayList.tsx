import { Gift } from "lucide-react";
import { format, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BirthdayStudent {
  id: string;
  name: string;
  birthDate: Date;
  photoUrl?: string;
}

interface BirthdayListProps {
  students: BirthdayStudent[];
  className?: string;
}

export function BirthdayList({ students, className = "" }: BirthdayListProps) {
  const currentMonth = new Date();
  
  const birthdaysThisMonth = students
    .filter((student) => isSameMonth(new Date(student.birthDate), currentMonth))
    .sort((a, b) => {
      const dayA = new Date(a.birthDate).getDate();
      const dayB = new Date(b.birthDate).getDate();
      return dayA - dayB;
    });

  if (birthdaysThisMonth.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`} data-testid="birthday-list-empty">
        <Gift className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Nenhum aniversário este mês
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} data-testid="birthday-list">
      {birthdaysThisMonth.map((student) => (
        <div
          key={student.id}
          className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
          data-testid={`birthday-item-${student.id}`}
        >
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-primary font-semibold text-sm">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{student.name}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(student.birthDate), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <Gift className="w-4 h-4 text-primary shrink-0" />
        </div>
      ))}
    </div>
  );
}
