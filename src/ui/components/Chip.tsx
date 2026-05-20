import { HTMLAttributes } from "react";
export function Chip({ className = "", children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-olive-soft text-white mr-1 mb-1 ${className}`} {...rest}>{children}</span>;
}
