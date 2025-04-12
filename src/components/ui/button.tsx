"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          size === "sm" ? "h-7 px-2.5 text-xs" : 
          size === "lg" ? "h-11 px-7 text-sm" : 
          "h-9 px-4 py-2 text-xs",
          variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
          variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" :
          variant === "outline" ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" :
          variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" :
          "text-primary underline-offset-4 hover:underline",
          isLoading && "pointer-events-none opacity-70",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button }; 