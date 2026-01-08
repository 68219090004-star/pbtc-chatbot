// pages/index.js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Load chats error:', error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chat/history?chatId=${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatName: 'แชทใหม่' })
      });

      if (response.ok) {
        const newChat = await response.json();
        setCurrentChatId(newChat.id);
        setMessages([]);
        loadChats();
        if (window.innerWidth <= 768) setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Create chat error:', error);
    }
  };

  const switchChat = async (chatId) => {
    setCurrentChatId(chatId);
    await loadMessages(chatId);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const deleteChat = async (chatId) => {
    if (!confirm('คุณต้องการลบแชทนี้ใช่หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chat/delete?chatId=${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setMessages([]);
        }
        loadChats();
      }
    } catch (error) {
      console.error('Delete chat error:', error);
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    if (!currentChatId) {
      await createNewChat();
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: userMessage,
      isBot: false,
      createdAt: new Date()
    }]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: currentChatId,
          message: userMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: data.message,
          isBot: true,
          createdAt: new Date()
        }]);
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '❌ เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อ Gemini AI ได้',
        isBot: true,
        createdAt: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>PBTC Chatbot - Powered by Gemini</title>
      </Head>

      <div className="container">
        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-section">
              <div className="logo-icon">🎓</div>
              <div className="logo-text">PBTC Chatbot</div>
            </div>
            <button 
              className="close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <button className="new-chat-btn" onClick={createNewChat}>
            ➕ แชทใหม่
          </button>

          <div className="chat-list">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              >
                <span onClick={() => switchChat(chat.id)}>
                  {chat.chatName}
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.[0]?.toUpperCase() || '👤'}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.username}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="chat-header">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="chat-title">PBTC Chatbot</div>
            <div className="ai-badge">🤖 Gemini 2.0</div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <h2>👋 ยินดีต้อนรับ!</h2>
                <p>เริ่มคุยกับ PBTC Chatbot (Powered by Google Gemini)</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                  <div className="message-avatar">
                    {msg.isBot ? '🤖' : '👤'}
                  </div>
                  <div className="message-content">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}>
                ส่ง 🚀
              </button>
            </form>
          </div>
        </div>

        <style jsx>{`
          .container {
            display: flex;
            height: 100vh;
            position: relative;
          }

          .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 99;
          }

          @media (max-width: 768px) {
            .overlay {
              display: block;
            }
          }

          .sidebar {
            width: 280px;
            background: linear-gradient(180deg, #1e3a5f 0%, #2c3e50 100%);
            color: white;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s;
            position: relative;
            z-index: 100;
          }

          @media (max-width: 768px) {
            .sidebar {
              position: fixed;
              height: 100%;
              transform: translateX(-100%);
            }

            .sidebar.show {
              transform: translateX(0);
            }
          }

          .sidebar-header {
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }

          .logo-text {
            font-size: 18px;
            font-weight: 600;
          }

          .close-btn {
            display: none;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }

          @media (max-width: 768px) {
            .close-btn {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .new-chat-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            margin: 15px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s;
          }

          .new-chat-btn:hover {
            transform: translateY(-2px);
          }

          .chat-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
          }

          .chat-item {
            padding: 12px 15px;
            margin-bottom: 5px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .chat-item:hover {
            background: rgba(255,255,255,0.15);
          }

          .chat-item.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .delete-btn {
            opacity: 0;
            background: #e74c3c;
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }

          .chat-item:hover .delete-btn {
            opacity: 1;
          }

          .sidebar-footer {
            padding: 15px;
            border-top: 1px solid rgba(255,255,255,0.1);
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
          }

          .user-avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .user-details {
            flex: 1;
            min-width: 0;
          }

          .user-name {
            font-weight: 600;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-email {
            font-size: 11px;
            opacity: 0.7;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .logout-btn {
            width: 100%;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
          }

          .logout-btn:hover {
            background: #c0392b;
          }

          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: white;
          }

          .chat-header {
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            gap: 15px;
            color: white;
          }

          .menu-btn {
            display: none;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
          }

          @media (max-width: 768px) {
            .menu-btn {
              display: block;
            }
          }

          .chat-title {
            flex: 1;
            font-size: 18px;
            font-weight: 600;
          }

          .ai-badge {
            background: rgba(255, 215, 0, 0.3);
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }

          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
          }

          .welcome-message {
            text-align: center;
            padding: 60px 20px;
            color: #666;
          }

          .welcome-message h2 {
            color: #667eea;
            font-size: 32px;
            margin-bottom: 15px;
          }

          .message {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            animation: slideIn 0.3s ease;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .message.user {
            flex-direction: row-reverse;
          }

          .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
          }

          .message.bot .message-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .message.user .message-avatar {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            line-height: 1.6;
            font-size: 14px;
          }

          .message.bot .message-content {
            background: white;
            border: 1px solid #e0e0e0;
            color: #333;
          }

          .message.user .message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 10px;
          }

          .typing-indicator span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #667eea;
            animation: typing 1.4s infinite;
          }

          .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }

          .chat-input {
            padding: 15px 20px;
            background: white;
            border-top: 1px solid #e0e0e0;
          }

          .chat-input form {
            display: flex;
            gap: 10px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .chat-input input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
          }

          .chat-input input:focus {
            border-color: #667eea;
          }

          .chat-input button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
          }

          .chat-input button:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          .chat-input button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </>
  );
}