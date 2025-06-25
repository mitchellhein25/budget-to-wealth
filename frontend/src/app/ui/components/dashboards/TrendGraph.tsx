import React from 'react'
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

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
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },

        title: {
          display: true,
          text: props.title,
        },
      },
    };

    const data = {
      labels: props.labels,
      datasets: props.datasets.map(dataset => ({
        type: dataset.type,
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor,
      })),
    };

    return (
      <div className="flex-1 flex flex-col">
        <div className="h-3/4 w-full">
          <Chart title={props.title} type="line" options={options} data={data} />
        </div>
      </div>
    );
}
