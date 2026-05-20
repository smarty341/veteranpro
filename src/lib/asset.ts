// Resolve a public-folder asset path with the deploy base prefix.
// Use this for static-string asset URLs that Vite cannot rewrite at build time
// (JSX <img src>, <link href>, manifest entries set at runtime, etc.).
//
//   asset("assets/logo/veteran_logo.svg")
//     → "/assets/logo/veteran_logo.svg"        on root deploys
//     → "/veteranpro/assets/logo/veteran_logo.svg"  on subpath deploys
//
// `import.meta.env.BASE_URL` mirrors Vite's `base` config and always ends in "/".
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
