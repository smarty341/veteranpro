import { ReactNode } from "react";
export function ScreenContainer({ children }: { children: ReactNode }) {
  return <main className="flex-1 overflow-y-auto px-5 py-3">{children}</main>;
}
