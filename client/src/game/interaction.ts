import type { GameObject, ThemeId } from "./data";

export const isCorrectDrop = (object: GameObject, zoneId: string) => object.targetId === zoneId;

export const progressKey = (themeId: ThemeId, level: number) => `${themeId}:${level}`;

export const isThemeComplete = (themeId: ThemeId, completed: Set<string>) => [1, 2, 3, 4, 5].every((level) => completed.has(progressKey(themeId, level)));

export const areAllThemesComplete = (themeIds: ThemeId[], completed: Set<string>) => themeIds.every((themeId) => isThemeComplete(themeId, completed));
