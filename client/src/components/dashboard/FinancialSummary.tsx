import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface FinancialSummaryProps {
  income: number;
  expenses: number;
  pendingPayments: number;
  className?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FinancialSummary({
  income,
  expenses,
  pendingPayments,
  className = "",
}: FinancialSummaryProps) {
  const balance = income - expenses;

  return (
    <div className={`space-y-4 ${className}`} data-testid="financial-summary">
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Receitas</p>
            <p className="font-semibold text-primary">{formatCurrency(income)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-destructive/20 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Despesas</p>
            <p className="font-semibold text-destructive">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pagamentos Pendentes</p>
            <p className="font-semibold text-muted-foreground">{formatCurrency(pendingPayments)}</p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Balanço</span>
          <span
            className={`font-bold text-lg ${
              balance >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {formatCurrency(balance)}
          </span>
        </div>
      </div>
    </div>
  );
}
