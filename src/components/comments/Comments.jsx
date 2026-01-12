'use client'

import styles from './comments.module.css'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const fetcher = async (url) => {
    const res = await fetch(url);

    const data = await res.json();

    if(!res.ok){
        const error = new Error(data.message);
        throw error;
    }

    return data;
}


const Comments = ({ postSlug }) => {

    const {status} = useSession()

    const {data,mutate,isLoading} = useSWR(
        `http://localhost:3000/api/comments?postSlug=${encodeURIComponent(postSlug)}`,
        fetcher
    );

    const [desc,setDesc] = useState("")

    const handleSubmit = async () =>{
        if (!desc.trim()) {
            alert('请输入评论内容');
            return;
        }
        try {
            const res = await fetch("/api/comments",{
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({desc, postSlug})
            })
            if (!res.ok) {
                const errorData = await res.json();
                console.error('评论发送失败:', errorData);
                alert('评论发送失败: ' + errorData.message);
                return;
            }
            const newComment = await res.json();
            console.log('评论发送成功，新评论:', newComment);
            setDesc('');
            // 重新获取数据以刷新列表
            console.log('正在刷新评论列表...');
            await mutate();
        } catch (err) {
            console.error('错误:', err);
            alert('发生错误，请检查控制台');
        }
    } 

  return (
    <div className={styles.container}>
        <div className={styles.title}>Comments</div>
        {status === 'authenticated' ? (
            <div className={styles.write}>
                <textarea placeholder="write a comment..." className={styles.input} onChange={e=>setDesc(e.target.value)} />
                <button className={styles.button} onClick={handleSubmit} >Send</button>
            </div>
        ) : (
            <Link href="/login">Login to write a comment</Link>
        )}
        <div className={styles.comments}>
            {isLoading
                ? "loading"
                : data?.map(item=>(
                    <div className={styles.comment}  key={item._id}>
                    <div className={styles.user}>
                            {item?.user?.image && <Image 
                                src={item.user.image} 
                                alt="" 
                                width={50} 
                                height={50} 
                                className={styles.image} 
                            />}
                        <div className={styles.userinfo}>
                            <span className={styles.username}>{item.user.name}</span>
                            <span className={styles.date}>{item.createdAt}</span>
                        </div>
                    </div>
                    <p className={styles.desc}>
                        {item.desc}
                    </p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Comments