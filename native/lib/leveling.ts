export const XP_PER_LEVEL = 500;
export const levelForXp = (xp: number): number => Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
export const xpIntoLevel = (xp: number): number => Math.max(0, xp) % XP_PER_LEVEL;
export const xpToNext = (xp: number): number => XP_PER_LEVEL - xpIntoLevel(xp);
