import React from "react";
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
    indexAxis: "y", //가로형 막대 그래프 설정
    plugins: {
      legend: {
        display: false, // 범례 삭제
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // x축 그리드 삭제
        },
        ticks: {
          display: false, // x축 데이터 수치 삭제
        },
      },
      y: {
        grid: {
          display: false, // y축 그리드 삭제
        },
      },
    },
  };

  return <Bar type="bar" data={data} options={options} />;
};
export default Chart;
