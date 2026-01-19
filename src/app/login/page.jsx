'use client'
import styles from './loginPage.module.css'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const LoginPage = () => {
  const {data,status} = useSession ()
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if(status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }
  if(status === "authenticated") {
    router.push("/")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocalAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // 登录
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('邮箱或密码错误');
        } else {
          router.push('/');
        }
      } else {
        // 注册
        if (formData.password !== formData.confirmPassword) {
          setError('两次密码输入不一致');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('密码长度至少6个字符');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || '注册失败');
        } else {
          // 注册成功后自动登录
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (result?.error) {
            setError('注册成功，但登录失败，请手动登录');
          } else {
            router.push('/');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{isLogin ? '登录' : '注册'}</h2>
            
            <form className={styles.form} onSubmit={handleLocalAuth}>
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="用户名"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="邮箱"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="密码"
                className={styles.input}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="确认密码"
                  className={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              )}
              
              {error && <div className={styles.error}>{error}</div>}
              
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
              </button>
            </form>

            <div className={styles.toggle}>
              {isLogin ? '还没有账户？' : '已有账户？'}
              <span onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}>
                {isLogin ? '立即注册' : '立即登录'}
              </span>
            </div>

            <div className={styles.divider}>或</div>
            
            <div className={styles.socialButton} onClick={() => signIn('google')}>
              Sign in with Google
            </div>
            <div className={styles.socialButton} onClick={() => signIn('github')}>
              Sign in with Github
            </div>
        </div>
    </div>
  )
}

export default LoginPage