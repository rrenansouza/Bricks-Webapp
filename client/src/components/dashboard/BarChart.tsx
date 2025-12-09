import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface BarChartData {
  name: string;
  value: number;
  label?: string;
}

interface BarChartProps {
  data: BarChartData[];
  barColor?: string;
  height?: number;
  className?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export function BarChart({
  data,
  barColor = "hsl(75, 100%, 50%)",
  height = 200,
  className = "",
  showXAxis = true,
  showYAxis = false,
}: BarChartProps) {
  return (
    <div className={className} data-testid="bar-chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          {showXAxis && (
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(173, 20%, 70%)', fontSize: 12 }}
            />
          )}
          {showYAxis && (
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(173, 20%, 70%)', fontSize: 12 }}
            />
          )}
          <Tooltip
            cursor={{ fill: 'rgba(182, 255, 0, 0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as BarChartData;
                return (
                  <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium">{item.label || item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.value} aulas</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={barColor} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
