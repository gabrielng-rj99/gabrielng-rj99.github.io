import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

const STORAGE_KEY = "portfolio-theme";

function isStorageAccessError(error: unknown): boolean {
    return typeof DOMException !== "undefined" && error instanceof DOMException;
}

function getSystemPreference(): Theme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getStoredTheme(): Theme | null {
    if (typeof window === "undefined") return null;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : null;
    } catch (error) {
        if (isStorageAccessError(error)) return null;
        throw error;
    }
}

function persistTheme(theme: Theme) {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        if (isStorageAccessError(error)) return;
        throw error;
    }
}

function getInitialTheme(): Theme {
    return getStoredTheme() ?? getSystemPreference();
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    const applyTheme = useCallback((t: Theme) => {
        const root = document.documentElement;
        root.setAttribute("data-theme", t);
        root.classList.remove("light", "dark");
        root.classList.add(t);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            persistTheme(next);
            return next;
        });
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [applyTheme, theme]);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");

        const handler = (e: MediaQueryListEvent) => {
            if (getStoredTheme() !== null) return;
            setTheme(e.matches ? "dark" : "light");
        };

        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
