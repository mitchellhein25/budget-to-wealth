import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export type TrendGraphProps = {
  title: string;
  labels: string[];
  datasets: TrendGraphDataset[];
}

export type TrendGraphDataset = {
  type: 'line' | 'bar';
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export default function TrendGraph(props: TrendGraphProps) {
  // Transform into Recharts-friendly data
  const chartData = props.labels.map((label, index) => {
    const point: Record<string, unknown> = { name: label };
    props.datasets.forEach(ds => {
      point[ds.label] = ds.data[index] ?? 0;
    });
    return point;
  });

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-3/4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
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
