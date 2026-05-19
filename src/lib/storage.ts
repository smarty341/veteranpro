export const STORAGE_PREFIX = "vp-companion:";
const SCHEMA = 1;

export function saveSlice<T>(slice: string, value: T): void {
  try { localStorage.setItem(`${STORAGE_PREFIX}${slice}`, JSON.stringify({ schema: SCHEMA, data: value })); }
  catch { /* quota — fall through, store will keep in-memory copy */ }
}

export function loadSlice<T>(slice: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slice}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed?.schema !== SCHEMA) return fallback;
    return parsed.data as T;
  } catch { return fallback; }
}

export function clearAll(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    for (const k of keys) localStorage.removeItem(k);
  } catch { /* no-op */ }
}
