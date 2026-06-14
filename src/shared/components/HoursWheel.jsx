import React from "react";

const HoursWheel = ({ remaining, total }) => {
  const radius = 45;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const used = total - remaining;
  const progress = used / total;

  const strokeDashoffset = circumference - progress * circumference;

  // ✅ format hours + minutes
  const formatHours = (hoursDecimal) => {
    const totalMinutes = Math.round(hoursDecimal * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  return (
    <div style={{ position: "relative", width: "90px", height: "90px" }}>
      <svg height={radius * 2} width={radius * 2}>
        {/* background circle */}
        <circle
          stroke="#eee"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* progress circle */}
        <circle
          stroke="orange"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.4s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* centered text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {formatHours(remaining)}
      </div>
    </div>
  );
};

export default HoursWheel;
