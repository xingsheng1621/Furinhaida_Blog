"use client";

import { useEffect, useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const ThemeProvider = ({ children }) => {

    const { theme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="light">{children}</div>;
    }

    return <div className={theme}>{children}</div>;
};

export default ThemeProvider;