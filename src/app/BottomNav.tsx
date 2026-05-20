// src/app/BottomNav.tsx
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

const items = [
  { to: "/catalog",      label: "Каталог",     icon: "ri:apps-2-line",      active: "ri:apps-2-fill" },
  { to: "/home",         label: "Головна",     icon: "ri:home-5-line",      active: "ri:home-5-fill" },
  { to: "/ai",           label: "AI",          icon: "ri:sparkling-2-line", active: "ri:sparkling-2-fill" },
  { to: "/applications", label: "Мої послуги", icon: "ri:file-list-3-line", active: "ri:file-list-3-fill" }
];

// No fixed height on the nav: items set their own min-height, and env(safe-area-inset-bottom)
// is added BELOW the content area instead of being absorbed into a fixed box.
// This keeps icons + labels their intended size in both Safari and PWA standalone mode.
export function BottomNav() {
  return (
    <nav className="bg-white border-t border-beige flex pb-[env(safe-area-inset-bottom)]">
      {items.map(it => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) =>
            `flex-1 relative flex flex-col items-center justify-center gap-1 min-h-[64px] py-2 text-[12px] ${
              isActive ? "text-brand font-semibold" : "text-[#a39e9b] font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute top-0 h-[3px] w-8 bg-olive rounded-b-md" aria-hidden />}
              <Icon
                icon={isActive ? it.active : it.icon}
                width={25}
                height={25}
                className={isActive ? "opacity-100" : "opacity-55"}
              />
              <span>{it.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
