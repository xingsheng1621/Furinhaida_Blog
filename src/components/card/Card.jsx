import styles from './card.module.css';
import Image from "next/image";
import Link from "next/link";

const Card = () => {
    return (
        <div className={styles.container}>
                <div className={styles.imgContainer}>
                    <Image src="/p1.jpeg" alt="" fill className={styles.image}/>
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.detail}>
                        <span className={styles.date}>16.12.2025</span>
                        <span className={styles.category}>CULTURE</span>
                    </div>
                <Link href="/" />
                <h1 className={styles.title}>这是一段博客文章的标题</h1>
                <p className={styles.desc}>
                    这是一段博客文章的简短描述，用于吸引读者点击阅读全文。这是一段博客文章的简短描述，用于吸引读者点击阅读全文。
                    这是一段博客文章的简短描述，用于吸引读者点击阅读全文。这是一段博客文章的简短描述，用于吸引读者点击阅读全文。
                    这是一段博客文章的简短描述，用于吸引读者点击阅读全文。这是一段博客文章的简短描述，用于吸引读者点击阅读全文。
                    这是一段博客文章的简短描述，用于吸引读者点击阅读全文。这是一段博客文章的简短描述，用于吸引读者点击阅读全文。
                    ............
                </p>
                <Link href="/" className={styles.link}>阅读更多</Link>
                </div>
        </div>
    )
}

export default Card;