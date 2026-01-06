import styles from './comments.module.css'
import Link from 'next/link'
import Image from 'next/image'

const Comments = () => {

    const status = 'authenticated'
  return (
    <div className={styles.container}>
        <div className={styles.title}>Comments</div>
        {status === 'authenticated' ? (
            <div className={styles.write}>
                <textarea placeholder="write a comment..." className={styles.input} />
                <button className={styles.button}>Send</button>
            </div>
        ) : (
            <Link href="/login">Login to write a comment</Link>
        )}
        <div className={styles.comments}>
            <div className={styles.comment}>
                <div className={styles.user}>
                        <Image 
                            src="/p1.jpeg" 
                            alt="" 
                            width={50} 
                            height={50} 
                            className={styles.image} 
                        />
                    <div className={styles.userinfo}>
                        <span className={styles.username}>测试用户1</span>
                        <span className={styles.date}>2025.12.17</span>
                    </div>
                </div>
                <p className={styles.desc}>
                    这是一条评论的内容，评论内容可以很长很长，包含用户的想法和反馈。
                </p>
            </div>
            <div className={styles.comment}>
                <div className={styles.user}>
                        <Image 
                            src="/p1.jpeg" 
                            alt="" 
                            width={50} 
                            height={50} 
                            className={styles.image} 
                        />
                    <div className={styles.userinfo}>
                        <span className={styles.username}>测试用户1</span>
                        <span className={styles.date}>2025.12.17</span>
                    </div>
                </div>
                <p className={styles.desc}>
                    这是一条评论的内容，评论内容可以很长很长，包含用户的想法和反馈。
                </p>
            </div>
            <div className={styles.comment}>
                <div className={styles.user}>
                        <Image 
                            src="/p1.jpeg" 
                            alt="" 
                            width={50} 
                            height={50} 
                            className={styles.image} 
                        />
                    <div className={styles.userinfo}>
                        <span className={styles.username}>测试用户1</span>
                        <span className={styles.date}>2025.12.17</span>
                    </div>
                </div>
                <p className={styles.desc}>
                    这是一条评论的内容，评论内容可以很长很长，包含用户的想法和反馈。
                </p>
            </div>
            <div className={styles.comment}>
                <div className={styles.user}>
                        <Image 
                            src="/p1.jpeg" 
                            alt="" 
                            width={50} 
                            height={50} 
                            className={styles.image} 
                        />
                    <div className={styles.userinfo}>
                        <span className={styles.username}>测试用户1</span>
                        <span className={styles.date}>2025.12.17</span>
                    </div>
                </div>
                <p className={styles.desc}>
                    这是一条评论的内容，评论内容可以很长很长，包含用户的想法和反馈。
                </p>
            </div>
        </div>
    </div>
  )
}

export default Comments