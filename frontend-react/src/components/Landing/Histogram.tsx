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
    <div
      style={{
        width,
        height,
        border: "1px solid #ccc",
        display: "flex",
        alignItems: "flex-end", // bars align to bottom
        justifyContent: "space-between",
        padding: "0 5px",
      }}
    >
      {bins.map((bin) => {
        const barHeight = (bin.count / maxCount) * (height - 20);

        return (
          <div
            key={bin.range}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              width: barWidth - 4,
            }}
          >
            {/* Count label */}
            <div style={{ marginBottom: "4px", fontSize: "10px", color: "#000" }}>
              {bin.count}
            </div>

            {/* Bar */}
            <div
              style={{
                width: "100%",
                height: barHeight,
                backgroundColor: "steelblue",
                borderRadius: "4px 4px 0 0",
              }}
            ></div>

            {/* Range label */}
            <div style={{ marginTop: "4px", fontSize: "9px", color: "#333" }}>
              {bin.range}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Histogram;
