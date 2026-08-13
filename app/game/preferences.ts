export interface GamePreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  compactCards: boolean;
  paperTexture: boolean;
  ambientGlow: boolean;
  confirmQuestionable: boolean;
}

const PREFERENCES_KEY = "reviewer2:preferences:v1";

export const DEFAULT_PREFERENCES: GamePreferences = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  compactCards: false,
  paperTexture: true,
  ambientGlow: true,
  confirmQuestionable: true,
};

export function readPreferences(): GamePreferences {
  try {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) ?? "{}") as Partial<GamePreferences>;
    return Object.fromEntries(Object.entries(DEFAULT_PREFERENCES).map(([key, fallback]) => [key, typeof parsed[key as keyof GamePreferences] === "boolean" ? parsed[key as keyof GamePreferences] : fallback])) as unknown as GamePreferences;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: GamePreferences) {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Preferences remain usable for this session.
  }
}
