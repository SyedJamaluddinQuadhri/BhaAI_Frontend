import { useEffect } from "react";
export function useKeyboardShortcut(keys: string[], callback: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const pressed = [
        event.metaKey ? "Meta" : "",
        event.ctrlKey ? "Control" : "",
        event.shiftKey ? "Shift" : "",
        event.key
      ].filter(Boolean);
      if (keys.every((key) => pressed.includes(key))) { event.preventDefault(); callback(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keys, callback]);
}
