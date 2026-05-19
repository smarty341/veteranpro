import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
export function Shell() {
  return (
    <div className="flex flex-col h-full min-h-screen max-w-[480px] mx-auto bg-beige-soft">
      <Outlet />
      <BottomNav />
    </div>
  );
}
