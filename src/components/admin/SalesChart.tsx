"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    time: "00:00",
    sales: 1234,
  },
  {
    time: "03:00",
    sales: 2345,
  },
  {
    time: "06:00",
    sales: 3456,
  },
  {
    time: "09:00",
    sales: 3245,
  },
  {
    time: "12:00",
    sales: 4567,
  },
  {
    time: "15:00",
    sales: 5678,
  },
  {
    time: "18:00",
    sales: 6789,
  },
  {
    time: "21:00",
    sales: 4567,
  },
  {
    time: "24:00",
    sales: 3456,
  },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
