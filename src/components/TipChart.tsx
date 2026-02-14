"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  month: string;
  amount: number;
}

interface TipChartProps {
  data: ChartData[];
}

/** Monthly tip amounts bar chart */
export default function TipChart({ data }: TipChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
      <h3 className="text-lg font-bold mb-6">نمودار انعام ماهانه</h3>
      <div style={{ width: "100%", height: 300 }} dir="ltr">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} تومان`,
                "مبلغ",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E8F7EF",
                direction: "rtl",
              }}
            />
            <Bar
              dataKey="amount"
              fill="#6BCF9C"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
