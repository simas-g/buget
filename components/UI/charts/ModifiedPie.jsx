import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        onClick: () => null,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let value = context.raw;
            return ` ${value} €`;
          },
        },
      },
    },
  };

  return (
    <div className="max-w-4xl max-h-96">
      <Pie data={data} options={options} />;
    </div>
  );
};

export default PieChart;
