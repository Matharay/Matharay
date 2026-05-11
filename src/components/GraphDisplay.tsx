import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, Area, AreaChart,
  BarChart, Bar, Cell,
} from "recharts";
import { Solution } from "@/contexts/AppContext";
import { useApp } from "@/contexts/AppContext";
import { getSubjectColor } from "@/lib/subjectColors";

interface Props { solution: Solution; }

const COLORS = ["#3B5BDB","#059669","#D97706","#DC2626","#7C3AED","#0891B2"];

const GraphDisplay = ({ solution }: Props) => {
  const { subject } = useApp();
  const sc = getSubjectColor(subject);

  if (!solution.graphData || solution.graphData.length === 0) return null;

  const series = solution.graphSeries ?? [{ key: "y", label: "f(x)", color: sc.accent }];
  const title  = solution.graphTitle  ?? "";
  const xLabel = solution.graphXLabel ?? "x";
  const yLabel = solution.graphYLabel ?? "y";

  const tooltipStyle = {
    contentStyle: {
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: 8,
      fontSize: 12,
    },
  };

  // ── Bar chart (for PIB components, VPN cash flows, etc.) ──
  if (solution.graphType === "bar") {
    const barKey = series[0]?.key ?? "y";
    return (
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        {title && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {title}
          </p>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={solution.graphData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: xLabel, position: "insideBottom", offset: -12, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
            <Bar dataKey={barKey} name={series[0]?.label ?? barKey}>
              {solution.graphData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    typeof entry[barKey] === "number" && (entry[barKey] as number) < 0
                      ? "#DC2626"
                      : series[0]?.color ?? sc.accent
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── Single-series area chart ──
  if (series.length === 1) {
    return (
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        {title && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {title}
          </p>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={solution.graphData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
            <defs>
              <linearGradient id={`grad-${subject}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={sc.accent} stopOpacity={0.25} />
                <stop offset="95%" stopColor={sc.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: xLabel, position: "insideBottom", offset: -12, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(3), series[0].label]} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
            <Area type="monotone" dataKey={series[0].key} stroke={sc.accent} strokeWidth={2}
              fill={`url(#grad-${subject})`} dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── Multi-series line chart ──
  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      {title && (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={solution.graphData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="x" stroke="hsl(var(--muted-foreground))" fontSize={11}
            label={{ value: xLabel, position: "insideBottom", offset: -12, fontSize: 11 }} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
          {series.map((s, i) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label}
              stroke={s.color ?? COLORS[i % COLORS.length]} strokeWidth={2}
              dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphDisplay;
