"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const BarChart = ({
  data,
  xAxisKey,
  dataKey,
  name,
  color,
  height = 320,
}: {
  data: Record<string, unknown>[];
  xAxisKey: string;
  dataKey: string;
  name: string;
  color: string;
  height?: number;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey={xAxisKey} stroke="#a1a1aa" fontSize={12} />
        <YAxis allowDecimals={false} stroke="#a1a1aa" fontSize={12} />
        <Tooltip
          contentStyle={{ background: "#18181b", border: "none" }}
          labelStyle={{ color: "#e4e4e7" }}
        />
        <Bar dataKey={dataKey} name={name} fill={color} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
