import styles from './Navbar.module.css';
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authlinks/AuthLinks";
import ThemeToggle from "../themtoggle/ThemeToggle";

const Navbar = () => {
    return (
    <div className={styles.container}>
        <div className={styles.social}>
            <Image src="/bilibili.png" alt="bilibili" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
            <Image src="/zhihu.png" alt="zhihu" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
            <Image src="/xiaohongshu.png" alt="xiaohongshu" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
            <Image src="/github.png" alt="github" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
        </div>
        <div className={styles.logo}>FuriNahida Blog</div>
        <div className={styles.links}>
            <ThemeToggle />
            <Link href="/" className={styles.link}>Homepage</Link>
            <Link href="/" className={styles.link}>Contact</Link>
            <Link href="/" className={styles.link}>About</Link>
            <AuthLinks />
        </div>
    </div>
    )
}

export default Navbar