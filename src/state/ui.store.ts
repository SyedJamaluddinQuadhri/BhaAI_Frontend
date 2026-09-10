export type Theme = "light" | "dark";
export interface UIState { theme: Theme; assistantOpen: boolean; }
export const defaultUIState: UIState = { theme: "light", assistantOpen: false };
