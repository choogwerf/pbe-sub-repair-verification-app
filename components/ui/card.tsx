import * as React from "react";

// Simple card primitives used to wrap page sections. These components
// intentionally avoid any heavy abstractions and instead provide a few
// opinionated Tailwind classes for spacing, background and borders.

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-xl border border-zinc-200 shadow-sm ${className}`.trim()}
      {...props}
    />
  )
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`px-4 py-3 border-b border-zinc-200 ${className}`.trim()}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-lg font-semibold leading-6 text-zinc-900 ${className}`.trim()}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`px-4 py-4 ${className}`.trim()}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";