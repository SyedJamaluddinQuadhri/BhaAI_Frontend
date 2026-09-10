import { useEffect, useState } from "react";
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("bhaai-theme") as "light" | "dark") || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("bhaai-theme", theme);
  }, [theme]);
  return { theme, toggleTheme: () => setTheme((t) => t === "light" ? "dark" : "light") };
}
