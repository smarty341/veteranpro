import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useStore } from "@/lib/store";
import { applyAccessibility } from "@/lib/applyAccessibility";

export function App() {
  const settings = useStore(s => s.settings);
  useEffect(() => { applyAccessibility(settings); }, [settings]);
  return <RouterProvider router={router} />;
}
