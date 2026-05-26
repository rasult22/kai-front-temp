import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";

interface ThemeContextType {
    theme: "dark";
    getEffectiveTheme: () => "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
    /**
     * The class to add to the root element for dark theme
     * @default "dark-mode"
     */
    darkModeClass?: string;
}

export const ThemeProvider = ({ children, darkModeClass = "dark-mode" }: ThemeProviderProps) => {
    const getEffectiveTheme = (): "dark" => {
        return "dark";
    };

    useEffect(() => {
        // Always apply dark theme
        const root = window.document.documentElement;
        root.classList.add(darkModeClass);
    }, [darkModeClass]);

    return <ThemeContext.Provider value={{ theme: "dark", getEffectiveTheme }}>{children}</ThemeContext.Provider>;
};
