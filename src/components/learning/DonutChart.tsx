'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, TooltipProps } from 'recharts';

interface DonutChartProps {
  data: {
    sname: string;
    srate: number;
    scolor: string;
  }[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  width?: number;
}

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: {
    name: string;
    value: number;
    payload: {
      sname: string;
      srate: number;
      scolor: string;
    };
  }[];
};

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  innerRadius = 60,
  outerRadius = 80,
  height = 300,
  width = 350,
}) => {
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="srate"
          nameKey="sname"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.scolor} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}; 