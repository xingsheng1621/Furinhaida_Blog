"use client"

import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

const GetFromLocalStorage = () => {
    // if(typeof window !== "undefined") {
    //     const value = localStorage.getItem("theme");
    //     return value || "light";
    // }
    
    
    // 这个部分代码修改了赋值逻辑
    if (typeof window === "undefined") {
        return "light"; // SSR 默认值，避免 undefined
    }
    const value = localStorage.getItem("theme");
    return value || "light";
}

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    const toggle = () => {
        setTheme((theme === "light" ? "dark" : "light"))
    };

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("theme", theme);
        }
    }, [theme, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, toggle , setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};