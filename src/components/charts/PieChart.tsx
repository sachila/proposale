"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const PieChart = ({
  data,
  height = 320,
  innerRadius = 60,
  outerRadius = 110,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#18181b", border: "none" }}
          labelStyle={{ color: "#e4e4e7" }}
        />
        <Legend wrapperStyle={{ color: "#e4e4e7" }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
