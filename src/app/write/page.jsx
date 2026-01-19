"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useState } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactQuill from "react-quill";

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) => {
    // 中文转拼音的映射表（常用汉字）
    const pinyinMap = {
      '中': 'zhong', '国': 'guo', '文': 'wen', '章': 'zhang', '标': 'biao', '题': 'ti',
      '我': 'wo', '的': 'de', '在': 'zai', '是': 'shi', '有': 'you', '和': 'he',
      '个': 'ge', '以': 'yi', '为': 'wei', '不': 'bu', '了': 'le', '一': 'yi',
      '上': 'shang', '下': 'xia', '天': 'tian', '大': 'da', '小': 'xiao', '多': 'duo',
      '好': 'hao', '新': 'xin', '旧': 'jiu', '技': 'ji', '术': 'shu', '学': 'xue',
      '生': 'sheng', '活': 'huo', '游': 'you', '记': 'ji', '笔': 'bi', '日': 'ri',
      '月': 'yue', '年': 'nian', '时': 'shi', '分': 'fen', '秒': 'miao', '美': 'mei',
      '食': 'shi', '物': 'wu', '品': 'pin', '家': 'jia', '园': 'yuan', '城': 'cheng',
      '市': 'shi', '省': 'sheng', '地': 'di', '方': 'fang', '东': 'dong', '西': 'xi',
      '南': 'nan', '北': 'bei', '左': 'zuo', '右': 'you', '前': 'qian', '后': 'hou'
    };

    let result = str
      .toLowerCase()
      .trim()
      .split('')
      .map(char => {
        // 如果是中文，用拼音映射替换，否则保留
        if (pinyinMap[char]) {
          return pinyinMap[char];
        }
        return char;
      })
      .join('')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 如果结果为空（可能是未映射的中文），使用替代方案
    if (!result) {
      result = 'post-' + Date.now();
    }

    return result;
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await res.json();
      setMedia(data.url || "");
    } catch (err) {
      console.error("Upload error", err);
      setUploadError("上传文件失败，请重试。");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setUploadError("");

    // 验证标题
    if (!title.trim()) {
      setUploadError("标题不能为空");
      return;
    }

    const slug = slugify(title);
    
    // 验证生成的slug不为空
    if (!slug) {
      setUploadError("标题需要包含有效的字符");
      return;
    }

    // 从HTML内容中提取纯文本作为desc
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const plainTextDesc = tempDiv.textContent || tempDiv.innerText || '';

    if (!plainTextDesc.trim()) {
      setUploadError("内容不能为空");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: plainTextDesc.substring(0, 200), // 限制desc长度并使用纯文本
          img: media,
          slug,
          catSlug: catSlug || "style", //If not selected, choose the general category
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
      } else {
        const errorData = await res.json();
        setUploadError(errorData.message || "发布失败，请稍后重试。");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setUploadError("发布失败，请稍后重试。");
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select className={styles.select} onChange={(e) => setCatSlug(e.target.value)}>
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>
            <button className={styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        {uploading ? "Uploading..." : "Publish"}
      </button>
      {uploadError && <p className={styles.error}>{uploadError}</p>}
    </div>
  );
};

export default WritePage;
