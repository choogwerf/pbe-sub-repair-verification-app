import * as React from "react";

// Basic input component. Provides a rounded border and some padding by
// default. Consumers can override or extend the styling via className.
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={`block w-full px-3 py-2 border border-zinc-300 rounded-md text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 ${className}`.trim()}
      {...props}
    />
  )
);
Input.displayName = "Input";