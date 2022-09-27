import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const Chart = ({ negativeCount, positiveCount }) => {
  const data = {
    labels: ["추천", "비추천"],
    datasets: [
      {
        data: [negativeCount, positiveCount],
        backgroundColor: ["#62bfad", "#ff8d8d"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar type="bar" data={data} options={options} />;
};
export default Chart;
