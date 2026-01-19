"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactQuill from "react-quill";

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
    setUploadSuccess("");
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
      setMediaPreview(data.url || "");
      
      // 显示上传完成提醒
      const fileType = selectedFile.type.startsWith('video') ? '视频' : '图片';
      setUploadSuccess(`${fileType}上传成功！`);
      
      // 3秒后自动清除提醒
      setTimeout(() => setUploadSuccess(""), 3000);
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

    // 从HTML内容中提取纯文本作为desc，保留段落结构
    let plainTextDesc = value
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();

    if (!plainTextDesc.trim()) {
      setUploadError("内容不能为空");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: plainTextDesc.substring(0, 200), // 摘要保留纯文本但保留换行
          content: value, // 完整的HTML内容
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
      <select className={styles.select} onChange={(e) => setCatSlug(e.target.value)} defaultValue="" disabled={categoriesLoading}>
        <option value="">{categoriesLoading ? "加载分类中..." : "选择文章分类..."}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.title}
          </option>
        ))}
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
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image" title="上传图片">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>
            <button className={styles.addButton} onClick={() => setShowVideoInput(!showVideoInput)} title="添加视频外链">
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        {showVideoInput && (
          <div className={styles.videoInput}>
            <input
              type="text"
              placeholder="输入视频URL (如: https://...)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={styles.urlInput}
            />
            <button 
              className={styles.confirmBtn}
              onClick={() => {
                if (videoUrl.trim()) {
                  setMediaPreview(videoUrl);
                  setShowVideoInput(false);
                  setUploadSuccess("视频链接已添加！");
                  setTimeout(() => setUploadSuccess(""), 3000);
                }
              }}
            >
              确认
            </button>
            <button 
              className={styles.cancelBtn}
              onClick={() => {
                setShowVideoInput(false);
                setVideoUrl("");
              }}
            >
              取消
            </button>
          </div>
        )}
        {mediaPreview && (
          <div className={styles.mediaPreview}>
            {mediaPreview.includes('http') || mediaPreview.endsWith('.mp4') || mediaPreview.endsWith('.webm') || mediaPreview.endsWith('.mov') ? (
              <div className={styles.videoPreview}>
                <video controls width="300">
                  <source src={mediaPreview} />
                  您的浏览器不支持视频标签
                </video>
                <button 
                  className={styles.removeBtn}
                  onClick={() => {
                    setMediaPreview("");
                    setVideoUrl("");
                  }}
                >
                  ✕ 删除
                </button>
              </div>
            ) : (
              <div className={styles.imagePreview}>
                <Image 
                  src={mediaPreview} 
                  alt="preview" 
                  width={300} 
                  height={200}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <button 
                  className={styles.removeBtn}
                  onClick={() => {
                    setMediaPreview("");
                    setMedia("");
                  }}
                >
                  ✕ 删除
                </button>
              </div>
            )}
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
      {uploadSuccess && <p className={styles.success}>{uploadSuccess}</p>}
    </div>
  );
};

export default WritePage;
