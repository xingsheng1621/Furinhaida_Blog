import styles from './menuposts.module.css';
import Link from "next/link";
import Image from "next/image";

const MenuPosts = ({withImage}) => {
    return (
        <div className={styles.items}>
            <Link href="/" className={styles.item}>
                {withImage && (
                <div className={styles.imageContainer}>
                    <Image src="/p1.jpeg" alt="menu1" fill className={styles.image}/>
                </div>
                )}
                <div className={styles.textContainer}>
                    <span className={`${styles.category} ${styles.travel}`}>
                        Travel
                    </span>
                    <h3 className={styles.postTitle}>
                        这是一段随机的描述性文本，暂时等待填充其相应的内容。
                    </h3>
                    <div className={styles.detail}>
                        <span className={styles.username}>文章作者</span>
                        <span className={styles.date}>2025-12-16</span>
                    </div>
                </div>  
            </Link>
            <Link href="/" className={styles.item}>
                {withImage && (
                <div className={styles.imageContainer}>
                    <Image src="/p1.jpeg" alt="menu1" fill className={styles.image}/>
                </div>
                )}
                <div className={styles.textContainer}>
                    <span className={`${styles.category} ${styles.culture}`}>
                        Culture
                    </span>
                    <h3 className={styles.postTitle}>
                        这是一段随机的描述性文本，暂时等待填充其相应的内容。
                    </h3>
                    <div className={styles.detail}>
                        <span className={styles.username}>文章作者</span>
                        <span className={styles.date}>2025-12-16</span>
                    </div>
                </div>  
            </Link>
            <Link href="/" className={styles.item}>
                {withImage && (
                <div className={styles.imageContainer}>
                    <Image src="/p1.jpeg" alt="menu1" fill className={styles.image}/>
                </div>
                )}
                <div className={styles.textContainer}>
                    <span className={`${styles.category} ${styles.coding}`}>
                        Coding
                    </span>
                    <h3 className={styles.postTitle}>
                        这是一段随机的描述性文本，暂时等待填充其相应的内容。
                    </h3>
                    <div className={styles.detail}>
                        <span className={styles.username}>文章作者</span>
                        <span className={styles.date}>2025-12-16</span>
                    </div>
                </div>  
            </Link>
            <Link href="/" className={styles.item}>
                {withImage && (
                <div className={styles.imageContainer}>
                    <Image src="/p1.jpeg" alt="menu1" fill className={styles.image}/>
                </div>
                )}
                <div className={styles.textContainer}>
                    <span className={`${styles.category} ${styles.fashion}`}>
                        Fashion
                    </span>
                    <h3 className={styles.postTitle}>
                        这是一段随机的描述性文本，暂时等待填充其相应的内容。
                    </h3>
                    <div className={styles.detail}>
                        <span className={styles.username}>文章作者</span>
                        <span className={styles.date}>2025-12-16</span>
                    </div>
                </div>  
            </Link>
        </div>
    )
}

export default MenuPosts