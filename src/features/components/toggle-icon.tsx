"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);


  if (!mounted) {
    return <div className="w-9 h-9 items-center justify-center d-flex" />; 
  }

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border rounded-md"
    >
      {theme === "dark" ? "☀️ Dark" : "🌙 Light"}
    </button>
  );
}


