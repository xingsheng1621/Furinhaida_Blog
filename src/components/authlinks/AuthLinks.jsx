'use client'
import { signOut } from 'next-auth/react';
import styles from './authlinks.module.css';
import Link from "next/link";
import { use, useState } from "react";
import { useSession } from 'next-auth/react';

const AuthLinks = () => {


    const  [open,setOpen] = useState(false);
    const  [dropdownOpen, setDropdownOpen] = useState(false);

    const {data: session, status} = useSession();
    return<>
    {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>Login</Link>
    ) : (
        <>
        <Link href="/write" className={styles.link}>Write</Link>
        <div className={styles.userMenu}>
            <span className={styles.username} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {session?.user?.name || session?.user?.email || "User"}
            </span>
            {dropdownOpen && (
                <div className={styles.dropdown}>
                    <Link href="/settings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        Setting
                    </Link>
                    <span className={styles.dropdownItem} onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                    }}>
                        Logout
                    </span>
                </div>
            )}
        </div>
        </>
    )}
    <div className={styles.burger} onClick={()=>setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
    </div>
    {open && (
        <div className={styles.responsiveMenu}>
            <Link href="/">Homepage</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
            {status === "unauthenticated" ? (
        <Link href="/login">Login</Link>
    ) : (
        <>
        <Link href="/write">Write</Link>
        <Link href="/settings">Setting</Link>
        <span className={styles.link} onClick={signOut}>Logout</span>
        </>
    )}
        </div>
    )}
    </>;
};

export default AuthLinks

