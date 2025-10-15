import * as React from "react";

// Basic textarea component. Applies similar styling to the Input component
// for consistency across form fields.
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", rows = 3, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={`block w-full px-3 py-2 border border-zinc-300 rounded-md text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 ${className}`.trim()}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";