"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import styles from "./settings.module.css";

const SettingsPage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleAvatarChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // 验证文件类型
    if (!selectedFile.type.startsWith("image/")) {
      setError("请选择图片文件");
      return;
    }

    // 验证文件大小 (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("图片大小不能超过5MB");
      return;
    }

    setError("");
    setMessage("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // 上传文件
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("上传文件失败");
      }

      const uploadData = await uploadRes.json();
      const avatarUrl = uploadData.url;

      // 更新用户头像
      const updateRes = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: avatarUrl,
        }),
      });

      if (!updateRes.ok) {
        throw new Error("更新头像失败");
      }

      // 更新session
      await update();
      
      setMessage("头像更新成功！");
      
      // 3秒后刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Avatar update error:", err);
      setError(err.message || "更新头像失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>个人设置</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>头像</h2>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <Image
                src={session?.user?.image || "/default-avatar.svg"}
                alt="User Avatar"
                width={120}
                height={120}
                className={styles.avatar}
              />
            </div>
            <div className={styles.avatarActions}>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
                disabled={uploading}
              />
              <label htmlFor="avatar" className={styles.uploadButton}>
                {uploading ? "上传中..." : "更换头像"}
              </label>
              <p className={styles.hint}>支持 JPG、PNG 格式，最大 5MB</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>基本信息</h2>
          <div className={styles.infoItem}>
            <label className={styles.label}>用户名</label>
            <div className={styles.value}>{session?.user?.name || "未设置"}</div>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.label}>邮箱</label>
            <div className={styles.value}>{session?.user?.email}</div>
          </div>
        </div>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export default SettingsPage;
