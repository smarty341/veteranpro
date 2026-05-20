import { Navigate, createBrowserRouter } from "react-router-dom";
import { Shell } from "./Shell";

// Screen imports — convert to React.lazy() if/when individual chunks need to be split.
import { LoginScreen }        from "@/features/onboarding/LoginScreen";
import { StatusScreen }       from "@/features/onboarding/StatusScreen";
import { RegionScreen }       from "@/features/onboarding/RegionScreen";
import { HomeScreen }         from "@/features/home/HomeScreen";
import { CatalogScreen }      from "@/features/catalog/CatalogScreen";
import { CategoryScreen }     from "@/features/catalog/CategoryScreen";
import { ServiceDetailScreen } from "@/features/catalog/ServiceDetailScreen";
import { AiScreen }           from "@/features/ai/AiScreen";
import { ApplicationsScreen } from "@/features/applications/ApplicationsScreen";
import { SettingsScreen }     from "@/features/settings/SettingsScreen";

export const router = createBrowserRouter([
  { path: "/",                   element: <LoginScreen /> },
  { path: "/onboarding/status",  element: <StatusScreen /> },
  { path: "/onboarding/region",  element: <RegionScreen /> },
  {
    element: <Shell />,
    children: [
      { path: "/home",                       element: <HomeScreen /> },
      { path: "/catalog",                    element: <CatalogScreen /> },
      { path: "/catalog/:categoryId",        element: <CategoryScreen /> },
      { path: "/catalog/service/:articleId", element: <ServiceDetailScreen /> },
      { path: "/ai",                         element: <AiScreen /> },
      { path: "/applications",               element: <ApplicationsScreen /> },
      { path: "/settings",                   element: <SettingsScreen /> }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
], {
  // Mirrors Vite's `base` — "/" for root deploys, "/repo-name/" on GitHub Pages.
  basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/"
});
