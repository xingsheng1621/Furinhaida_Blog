import styles from './CategoryList.module.css';
import Link from "next/link";
import Image from "next/image";


const getData = async () => {
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
    });
    if(!res.ok){
        throw  new Error("Failed");
    }

    return res.json()
};

const CategoryList = async () => {

    const data = await getData();

    return (
    <div className={styles.container}>
        <h1 className={styles.title}>核心文章</h1>
        <div className={styles.categries}>
            {data?.map(item=>(
                <Link 
                    href="/blog?cat=style" 
                    className={`${styles.categrie} ${styles[item.slug]}`}
                    key={item._id}
                >
                {item.img && (
                    <Image
                    src={item.img}
                    alt=""
                    width={32}
                    height={32}
                    className={styles.image}
                    />
                )}
                {item.title}
                </Link>
            ))}
        </div>
    </div>
    )
}

export default CategoryList