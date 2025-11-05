import { cn } from "@/lib/utils";

interface LoaderProps {
  /**
   * The size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * The variant of the loader
   * @default "spinner"
   */
  variant?: "spinner" | "dots" | "pulse";
  /**
   * Whether to show the loading text
   * @default true
   */
  showText?: boolean;
  /**
   * Custom loading text
   * @default "Loading..."
   */
  text?: string;
  /**
   * Whether to center the loader
   * @default false
   */
  center?: boolean;
  /**
   * Whether to make it a full page loader
   * @default false
   */
  fullPage?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const SpinnerLoader = ({
  size = "md",
  className,
}: {
  size: LoaderProps["size"];
  className?: string;
}) => (
  <div
    className={cn(
      "animate-spin rounded-full border-2 border-muted border-t-primary",
      sizeClasses[size!],
      className
    )}
  />
);

const DotsLoader = ({
  size = "md",
  className,
}: {
  size: LoaderProps["size"];
  className?: string;
}) => {
  const dotSize =
    size === "sm"
      ? "h-2 w-2"
      : size === "md"
        ? "h-3 w-3"
        : size === "lg"
          ? "h-4 w-4"
          : "h-6 w-6";

  return (
    <div className={cn("flex space-x-1", className)}>
      <div
        className={cn("animate-bounce rounded-full bg-primary", dotSize)}
        style={{ animationDelay: "0ms" }}
      />
      <div
        className={cn("animate-bounce rounded-full bg-primary", dotSize)}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={cn("animate-bounce rounded-full bg-primary", dotSize)}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
};

const PulseLoader = ({
  size = "md",
  className,
}: {
  size: LoaderProps["size"];
  className?: string;
}) => (
  <div
    className={cn(
      "animate-pulse rounded-full bg-primary",
      sizeClasses[size!],
      className
    )}
  />
);

export function Loader({
  size = "md",
  variant = "spinner",
  showText = true,
  text = "Loading...",
  center = false,
  fullPage = false,
  className,
}: LoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <DotsLoader size={size} />;
      case "pulse":
        return <PulseLoader size={size} />;
      default:
        return <SpinnerLoader size={size} />;
    }
  };

  const content = (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {renderLoader()}
      {showText && (
        <p
          className={cn(
            "text-muted-foreground",
            size === "sm"
              ? "text-xs"
              : size === "md"
                ? "text-sm"
                : size === "lg"
                  ? "text-base"
                  : "text-lg"
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  if (center) {
    return (
      <div className="flex items-center justify-center p-4">{content}</div>
    );
  }

  return content;
}

// Convenience components for common use cases
export const FullPageLoader = (props: Omit<LoaderProps, "fullPage">) => (
  <Loader {...props} fullPage />
);

export const CenteredLoader = (props: Omit<LoaderProps, "center">) => (
  <Loader {...props} center />
);

export const InlineLoader = (
  props: Omit<LoaderProps, "showText" | "center" | "fullPage">
) => <Loader {...props} showText={false} />;
