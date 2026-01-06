import styles from './featured.module.css';
import Image from "next/image";

const Featured = () => {
    return (
    <div className={styles.container}>
        <h1 className={styles.title}><b>这是博客欢迎关键词!</b>这是简略网站座右铭
        </h1>
        <div className={styles.post}>
            <div className={styles.imgContainer}>
                <Image src="/p1.jpeg" alt="" fill={true} className={styles.image}/>
            </div>
            <div className={styles.textContainer}>  
                <h1 className={styles.postTitle}>这是首页头图的标题</h1>
                <p className={styles.postDesc}>这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                这是横幅文章的内容,让我们说中文
                </p>
                <button className={styles.button}>阅读更多</button>
            </div>
        </div>
    </div>
    )
}

export default Featured