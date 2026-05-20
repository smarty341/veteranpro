import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/globals.css";
import { App } from "./app/App";
import { applyAccessibility } from "./lib/applyAccessibility";
import { useStore } from "./lib/store";

applyAccessibility(useStore.getState().settings);

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
