"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <div
      onClick={toggleTheme}
      className="flex gap-2 items-center cursor-pointer"
    >
      <div className="relative">
        {theme === "light" ? (
          <Moon className="w-2 h-2" />
        ) : (
          <Sun className="w-2 h-2" />
        )}
      </div>
      <span className="capitalize">
        {theme === "light" ? "Change to Dark" : "Change to Light"}
      </span>
    </div>
  );
}
