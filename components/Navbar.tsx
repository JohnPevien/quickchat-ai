"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-end px-4 py-4 bg-transparent backdrop-blur-sm">
            <button
                aria-label="Toggle theme"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="rounded-md p-2 hover:bg-muted/20 transition-colors"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </nav>
    );
}
