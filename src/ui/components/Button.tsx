import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const base = "w-full rounded-card py-4 text-sm font-semibold leading-none";
const styles: Record<Variant, string> = {
  primary: "bg-brand text-white",
  outline: "bg-white text-brand border-[1.5px] border-brand"
};

export function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
