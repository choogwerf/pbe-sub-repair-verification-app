import * as React from "react";

// Basic button component used throughout the app. This wrapper simply forwards
// standard button props and allows optional styling via the `className` prop.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        // Apply a few sensible defaults: display inline-flex so icons and
        // labels align nicely, center content, and round the corners. Extra
        // classes passed in via className can override these styles.
        className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium ${className}`.trim()}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
