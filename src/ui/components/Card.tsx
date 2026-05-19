import { HTMLAttributes } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white border border-beige rounded-card p-4 shadow-[var(--vp-elevation)] ${className}`} {...rest}>
      {children}
    </div>
  );
}
