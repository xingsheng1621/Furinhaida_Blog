"use client"
import styles from './writePage.module.css'
import Image from 'next/image'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.bubble.css'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const WritePage = () => {

  const {data,status} = useSession ()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  if(status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }
  if(status === "authenticated") {
    router.push("/")
  }

  return (
    <div className={styles.container}>
      <input type="text" placeholder='Title' className={styles.input} />
      <div className={styles.editorContainer}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="Add" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
          <button className={styles.addButton}>
          <Image src="/image.png" alt="image" width={16} height={16} />
          </button>
          <button className={styles.addButton}>
          <Image src="/external.png" alt="external" width={16} height={16} />
          </button>
          <button className={styles.addButton}>
          <Image src="/video.png" alt="video" width={16} height={16} />
          </button>
          </div>
        )}
        <ReactQuill 
        theme="bubble" 
        value={value} 
        onChange={setValue} 
        className={styles.textArea} 
        placeholder="Tell your story..." 
        />
      </div>
      <button className={styles.publish}>Publish</button>
    </div>
  )
} 
export default WritePage