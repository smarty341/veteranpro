import { ButtonHTMLAttributes } from "react";
import { tapLight } from "@/lib/haptics";

type Variant = "primary" | "outline";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const base = "w-full rounded-card py-4 text-base font-semibold leading-none transition-shadow active:scale-[0.98]";
const styles: Record<Variant, string> = {
  // Primary CTA — brand-tinted shadow communicates a lifted button.
  primary: "bg-brand text-white shadow-[var(--vp-button-shadow)]",
  outline: "bg-white text-brand border-[1.5px] border-brand"
};

export function Button({ variant = "primary", className = "", children, onClick, ...rest }: Props) {
  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      onClick={(e) => { tapLight(); onClick?.(e); }}
      {...rest}
    >
      {children}
    </button>
  );
}
