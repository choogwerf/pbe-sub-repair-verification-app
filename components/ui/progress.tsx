import * as React from "react";

// Progress bar component. Displays a simple horizontal bar with a filled
// portion representing the percentage value provided. The parent
// component controls the width via the `value` prop (0–100).

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export const Progress: React.FC<ProgressProps> = ({ value = 0, className = "", ...props }) => {
  const percent = Math.min(Math.max(value, 0), 100);
  return (
    <div
      className={`relative h-2 rounded-full bg-zinc-200 overflow-hidden ${className}`.trim()}
      {...props}
    >
      <div
        className="absolute inset-y-0 left-0 bg-green-600"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};