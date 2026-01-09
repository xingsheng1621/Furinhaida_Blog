import Comments from '@/components/comments/Comments'
import styles from './singlePage.module.css'
import Menu from '@/components/Menu/Menu'
import Image from 'next/image'

const getData = async ({ slug }) => {
    const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("Failed");
    }   

    return res.json()
};

const SinglePage = async ({ params }) => {

  const {slug} = params;

  const data = await getData({ slug });

  return (
    <div className={styles.container}>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>
              {data?.title}
              </h1>
            <div className={styles.user}>
              {data?.img && (<div className={styles.userImageContainer}>
                <Image src="/p1.jpeg" alt="" fill className={styles.avatar} />
              </div>)}
              <div className={styles.userTextcontainer}>
                <span className={styles.username}>Username</span>
                <span className={styles.date}>2025.12.17</span>
              </div>
            </div>
          </div>
          {data?.img && (<div className={styles.imageContainer}>
            <Image src={data?.img} alt="" fill className={styles.image} />
          </div>)}
        </div>
        <div className={styles.content}>
          <div className={styles.post}>
            <div className={styles.description} dangerouslySetInnerHTML={{__html:data.description}} />
            <div className={styles.comments}>
              <Comments/>
            </div>
          </div>
            <Menu/>
        </div>
    </div>
  )
}

export default SinglePage