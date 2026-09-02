import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "crimson" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 1. Base Styles: Manrope 600, Letter Spacing, Rounded Corners
    const baseStyles =
      "inline-flex items-center justify-center font-sans tracking-[0.08em] font-semibold rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1714] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none active:scale-[0.98]";

    // 2. Variant Styles
    const variantStyles = {
      primary:
        "btn-brass",
      secondary:
        "btn-secondary-brass",
      outline:
        "border border-[#4A3F35] bg-[#251E19]/80 text-[#E8DFD4] hover:border-[#C9A962] hover:text-[#C9A962] hover:bg-[#251E19]",
      crimson:
        "bg-[#8B2635] text-[#E8DFD4] border border-[#A62D3F]/50 shadow-crimson hover:bg-[#A62D3F] hover:shadow-lg",
      ghost:
        "text-[#C9A962] hover:text-[#D4B872] hover:underline underline-offset-4 bg-transparent p-0 tracking-[0.18em]",
    };

    // 3. Size Styles
    const sizeStyles = {
      sm: "h-9 px-4 text-[11px] gap-1.5",
      md: "h-11 px-6 text-xs gap-2",
      lg: "h-13 px-8 text-sm gap-2.5",
    };

    const combined = `${baseStyles} ${variantStyles[variant]} ${
      variant === "ghost" ? "" : sizeStyles[size]
    } ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={combined}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
