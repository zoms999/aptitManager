'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, TooltipProps } from 'recharts';

interface DonutChartProps {
  data: {
    sname: string;
    srate: number;
    scolor?: string | null; // scolor가 없을 수도 있으므로 optional로 변경
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
      scolor?: string | null; // optional 반영
    };
  }[];
};

// 타입 정의 추가
interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  innerRadius = 70,
  outerRadius = 100,
  height = 300,
  width = 400, // 기본 너비 설정 (필요에 따라 조정)
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

  const renderColorfulLegendText = (value: string) => {
    return (
      <span className="text-gray-700 text-sm">{value}</span>
    );
  };

  // --- 수정된 색상 생성 함수 ---
  const getSlightlyDarkerPastelColor = (color: string | undefined | null, index: number): string => {
    // 기본 파스텔 색상 팔레트 (약간 더 채도가 있는 파스텔톤)
    const defaultPastelColors = [
        '#FFCBB7', // 살구색 (조금 더 진하게)
        '#BDE4E4', // 하늘색 (조금 더 진하게)
        '#FFF4B0', // 레몬색 (조금 더 진하게)
        '#D1DBE0', // 회하늘색 (조금 더 진하게)
        '#C8E6C0', // 민트색 (조금 더 진하게)
        '#EFDADA', // 핑크베이지 (조금 더 진하게)
        '#D8D8F5', // 라벤더 (조금 더 진하게)
        '#FFE1EB', // 핑크 (조금 더 진하게)
    ];

    // 입력된 색상이 유효하지 않으면 기본 팔레트 사용
    if (!color || (!color.startsWith('#') && !color.startsWith('rgb'))) {
      return defaultPastelColors[index % defaultPastelColors.length];
    }

    let r: number, g: number, b: number;

    try {
        // HEX 색상 처리 (# RRGGBB 또는 #RGB)
        if (color.startsWith('#')) {
            let hex = color.substring(1);
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            if (hex.length !== 6) throw new Error('Invalid HEX color');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        // RGB 색상 처리 (rgb(r, g, b))
        else if (color.startsWith('rgb')) {
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (!match) throw new Error('Invalid RGB color');
            r = parseInt(match[1], 10);
            g = parseInt(match[2], 10);
            b = parseInt(match[3], 10);
            if ([r, g, b].some(val => val < 0 || val > 255)) throw new Error('Invalid RGB value');
        } else {
            throw new Error('Unknown color format');
        }

        // --- 색상 밝기 조정 ---
        // lightenFactor 값을 줄여서 덜 밝게 (더 진하게) 만듭니다. (예: 0.75 -> 0.5)
        // 값이 0에 가까울수록 원본 색상과 비슷해지고, 1에 가까울수록 흰색에 가까워집니다.
        const lightenFactor = 0.5; // <--- 이 값을 조정하여 진하기를 조절하세요 (0.4 ~ 0.6 사이 추천)
        // --- --- --- --- ---

        const lighterR = Math.min(255, Math.floor(r + (255 - r) * lightenFactor));
        const lighterG = Math.min(255, Math.floor(g + (255 - g) * lightenFactor));
        const lighterB = Math.min(255, Math.floor(b + (255 - b) * lightenFactor));

        const toHex = (c: number) => c.toString(16).padStart(2, '0');
        return `#${toHex(lighterR)}${toHex(lighterG)}${toHex(lighterB)}`;

    } catch (error) {
        console.warn(`Color processing error for "${color}": ${(error as Error).message}. Using default pastel color.`);
        // 오류 발생 시에도 약간 더 진한 기본 팔레트 사용
        return defaultPastelColors[index % defaultPastelColors.length];
    }
  };
  // --- --- --- --- ---

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value
  }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (value < 3) {
        return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="#4A5568"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="11px"
        fontWeight="600"
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="srate"
          nameKey="sname"
          paddingAngle={1}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              // 수정된 색상 함수 사용
              fill={getSlightlyDarkerPastelColor(entry.scolor, index)}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={renderColorfulLegendText}
          iconSize={12}
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{
            paddingLeft: '20px',
            fontSize: '12px',
            lineHeight: '20px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};