import React from 'react';
import { useMobileDetection } from '@/app/hooks';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export type TrendGraphProps = {
  title: string;
  labels: string[];
  datasets: TrendGraphDataset[];
  height?: number;
}

export type TrendGraphDataset = {
  type: 'line' | 'bar';
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export function TrendGraph(props: TrendGraphProps) {
  const isMobile = useMobileDetection();
  // Transform into Recharts-friendly data
  const chartData = props.labels.map((label, index) => {
    const point: Record<string, unknown> = { name: label };
    props.datasets.forEach(ds => {
      point[ds.label] = ds.data[index] ?? 0;
    });
    return point;
  });

  const height = isMobile ? 240 : 420;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="mb-2">
        <h3 className="text-base sm:text-lg font-semibold text-base-content">{props.title}</h3>
      </div>
      <div className="w-full min-w-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {props.datasets.map(ds =>
              ds.type === 'line' ? (
                <Line
                  key={ds.label}
                  type="monotone"
                  dataKey={ds.label}
                  stroke={ds.borderColor}
                  dot={false}
                />
              ) : (
                <Bar
                  key={ds.label}
                  dataKey={ds.label}
                  fill={ds.backgroundColor}
                />
              )
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
