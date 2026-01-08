// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - PBTC Chatbot</title>
      </Head>
      
      <div className="login-container">
        <div className="logo">
          <div className="logo-icon">🎓</div>
          <h1>ยินดีต้อนรับกลับ</h1>
          <p className="subtitle">เข้าสู่ระบบ PBTC Chatbot</p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="divider">หรือ</div>

        <div className="register-link">
          ยังไม่มีบัญชี? <a href="/register">สมัครสมาชิก</a>
        </div>

        <style jsx>{`
          .login-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .login-container > * {
            width: 100%;
            max-width: 450px;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }

          .logo {
            text-align: center;
            margin-bottom: 30px;
          }

          .logo-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin-bottom: 15px;
          }

          h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
          }

          .subtitle {
            color: #666;
            font-size: 14px;
          }

          .error-message {
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          label {
            display: block;
            color: #555;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 14px;
          }

          input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            transition: border 0.3s;
            outline: none;
          }

          input:focus {
            border-color: #667eea;
          }

          .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .btn:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .divider {
            text-align: center;
            margin: 25px 0;
            color: #999;
            position: relative;
          }

          .divider::before,
          .divider::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 40%;
            height: 1px;
            background: #e0e0e0;
          }

          .divider::before { left: 0; }
          .divider::after { right: 0; }

          .register-link {
            text-align: center;
            color: #666;
            font-size: 14px;
          }

          .register-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
          }

          .register-link a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </>
  );
}