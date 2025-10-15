import * as React from "react";

// A minimal tab system implemented using React context. Tabs maintains
// internal state for the current value and provides it to triggers and
// content via context. The styling is intentionally simple and can be
// overridden via className props on each component.

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [value, setValue] = React.useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}
export const TabsList: React.FC<TabsListProps> = ({ className = "", ...props }) => (
  <div className={`inline-flex space-x-2 ${className}`.trim()} {...props} />
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className = "", children, ...props }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-2 rounded-md text-sm font-medium ${active ? "bg-green-600 text-white" : "bg-white text-zinc-700"} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
export const TabsContent: React.FC<TabsContentProps> = ({ value, className = "", children, ...props }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");
  return ctx.value === value ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null;
};