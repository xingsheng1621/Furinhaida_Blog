"use client"
import { useContext, useEffect, useState } from "react";
import styles from './themeToggle.module.css';
import Image from "next/image";
import { ThemeContext } from "@/context/ThemeContext";

const ThemeToggle = () => {

    const{theme,toggle} =useContext(ThemeContext)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const containerStyle = mounted && theme === "dark" 
        ? {left:1,background:"white"} 
        : {right:1,background:"#0f172a"};
    
    const ballStyle = mounted && theme === "dark" 
        ? {left:1,background:"#0f172a"} 
        : {right:1,background:"white"};

    return (
    <div className={styles.container} onClick={toggle} style={containerStyle}>
        <Image src="/moon.png" alt="" width={14} height={14} />
        <div className={styles.ball} style={ballStyle}></div>
        <Image src="/sun.png" alt="" width={14} height={14} />
    </div>
    )
}

export default ThemeToggle
