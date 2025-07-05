import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Common page container
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      {children}
    </div>
  );
}

// Page header with title and description
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// Centered content container
export function CenteredContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[calc(100vh-164px)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// Loading state container
export function LoadingContainer({
  children = "Loading...",
}: {
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">{children}</div>
    </div>
  );
}

// Error state container
export function ErrorContainer({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-800">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// Empty state container
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">{title}</p>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {action}
    </div>
  );
}

// Card grid layout
export function CardGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// Flex container with common patterns
export function FlexContainer({
  children,
  direction = "row",
  justify = "start",
  align = "start",
  gap = "4",
  className,
}: {
  children: ReactNode;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around";
  align?: "start" | "center" | "end" | "stretch";
  gap?: "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16";
  className?: string;
}) {
  const directionClass = direction === "col" ? "flex-col" : "flex-row";
  const justifyClass = `justify-${justify}`;
  const alignClass = `items-${align}`;

  // Use explicit class mapping to ensure Tailwind includes them
  const gapClassMap: Record<string, string> = {
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
    "12": "gap-12",
    "16": "gap-16",
  };

  const gapClass = gapClassMap[gap];

  const combinedClasses = cn(
    "flex",
    directionClass,
    justifyClass,
    alignClass,
    gapClass,
    className
  );

  return <div className={combinedClasses}>{children}</div>;
}
