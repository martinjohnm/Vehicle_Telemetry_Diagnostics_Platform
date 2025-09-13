import React from "react";

type SpeedBin = { range: string; count: number };

interface HistogramProps {
  bins: SpeedBin[];
  width?: number;
  height?: number;
}

const Histogram: React.FC<HistogramProps> = ({ bins, width = 400, height = 250 }) => {
  if (!bins.length) return <p>No data</p>;

  const maxCount = Math.max(...bins.map((b) => b.count), 1);
  const barWidth = width / bins.length;

  return (
    <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
      {bins.map((bin, i) => {
        const barHeight = (bin.count / maxCount) * (height - 20); // leave room for labels
        return (
          <g key={bin.range} transform={`translate(${i * barWidth}, ${height - barHeight})`}>
            <rect
              width={barWidth - 4}
              height={barHeight}
              fill="steelblue"
              rx={4}
            />
            <text
              x={barWidth / 2}
              y={15}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
              transform={`translate(0, ${barHeight})`}
            >
              {bin.range}
            </text>
            <text
              x={barWidth / 2}
              y={-4}
              textAnchor="middle"
              fontSize="10"
              fill="#000"
            >
              {bin.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Histogram;
