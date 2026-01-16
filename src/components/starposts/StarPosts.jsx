import styles from './starposts.module.css';
import Link from "next/link";
import Image from "next/image";
import prisma from "@/utils/connect";

const getData = async () => {
    try {
        // 获取标记为推荐的文章，最多5篇
        const posts = await prisma.post.findMany({
            where: {
                featured: true
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true,
            },
        });
        return { posts };
    } catch (err) {
        console.log(err);
        return { posts: [] };
    }
};

const StarPosts = async ({withImage}) => {
    const { posts } = await getData();

    return (
        <div className={styles.items}>
            {posts?.map((post) => (
                <Link href={`/posts/${post.slug}`} className={styles.item} key={post.id}>
                    {withImage && post.img && (
                        <div className={styles.imageContainer}>
                            <Image src={post.img} alt={post.title} fill className={styles.image}/>
                        </div>
                    )}
                    <div className={styles.textContainer}>
                        {post.catSlug && (
                            <span className={`${styles.category} ${styles[post.catSlug]}`}>
                                {post.catSlug}
                            </span>
                        )}
                        <h3 className={styles.postTitle}>
                            {post.title}
                        </h3>
                        <div className={styles.detail}>
                            <span className={styles.username}>{post.user?.name || '匿名用户'}</span>
                            <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                    </div>  
                </Link>
            ))}
        </div>
    )
}

export default StarPosts
