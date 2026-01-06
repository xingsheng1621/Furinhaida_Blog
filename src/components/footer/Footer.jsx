import styles from './footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
    <div className={styles.container}>
        <div className={styles.info}>
            <div className={styles.logo}>
                <Image src="/logo.png" alt='FuriNahida blog' width={50} height={50}/>
                <h1 className={styles.title}>FuriNahida Blog</h1>
            </div>
            <p className={styles.description}>
                这是一段博客的自我介绍，我暂时也不知道应该写什么，所以就放在这吧。
                这是一段博客的自我介绍，我暂时也不知道应该写什么，所以就放在这吧。
            </p>
            <div className={styles.icons}>
                <Image src="/bilibili.png" alt="bilibili" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
                <Image src="/zhihu.png" alt="zhihu" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
                <Image src="/xiaohongshu.png" alt="xiaohongshu" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
                <Image src="/github.png" alt="github" width={24} height={24} className={styles.icon} style={{ borderRadius: '20%' }}/>
            </div>
        </div>
        <div className={styles.links}>
            <div className={styles.list}>
                <span className={styles.listTitle}>Links</span>
                <Link href="/" >Homepage</Link>
                <Link href="/" >Blog</Link>
                <Link href="/" >About</Link>
                <Link href="/" >Contact</Link>
            </div>
            <div className={styles.list}>
                <span className={styles.listTitle}>Tags</span>
                <Link href="/" >Style</Link>
                <Link href="/" >Fashion</Link>
                <Link href="/" >Coding</Link>
                <Link href="/" >Travel</Link>
            </div>
            <div className={styles.list}>
                <span className={styles.listTitle}>Social</span>
                <Link href="/" >BiliBili</Link>
                <Link href="/" >zhihu</Link>
                <Link href="/" >xiaohongshu</Link>
                <Link href="/" >github</Link>
            </div>
        </div>
    </div>
    )
}

export default Footer