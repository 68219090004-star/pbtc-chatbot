// components/ChatBox.js
import { useEffect, useRef } from 'react';

export default function ChatBox({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="chat-box">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🎓</div>
            <h2>👋 ยินดีต้อนรับสู่ PBTC Chatbot!</h2>
            <p>ระบบแชทบอท AI ที่ขับเคลื่อนด้วย Google Gemini</p>
            <div className="features">
              <div className="feature">⚡ ตอบเร็ว 2-10 วินาที</div>
              <div className="feature">🇹🇭 รองรับภาษาไทย</div>
              <div className="feature">🤖 AI ล้ำสมัย</div>
            </div>
            <p className="start-hint">เริ่มต้นด้วยการพิมพ์ข้อความด้านล่าง 👇</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                <div className="message-avatar">
                  {msg.isBot ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <style jsx>{`
        .chat-box {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }

        .chat-box::-webkit-scrollbar {
          width: 8px;
        }

        .chat-box::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .chat-box {
            padding: 15px 10px;
          }
        }

        .welcome-message {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .welcome-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .welcome-message h2 {
          color: #667eea;
          font-size: 28px;
          margin-bottom: 15px;
        }

        .welcome-message p {
          font-size: 16px;
          margin-bottom: 30px;
        }

        .features {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .feature {
          background: white;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .start-hint {
          color: #999;
          font-size: 14px;
          animation: fadeIn 2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        @media (max-width: 768px) {
          .message-avatar {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }
        }

        .message.bot .message-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .message.user .message-avatar {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .message-content {
            max-width: 80%;
          }
        }

        .message-text {
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.6;
          font-size: 14px;
          word-wrap: break-word;
        }

        .message.bot .message-text {
          background: white;
          border: 1px solid #e0e0e0;
          color: #333;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message.user .message-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .message-time {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
          padding: 0 8px;
        }

        .message.user .message-time {
          text-align: right;
          color: #667eea;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 18px;
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
      `}</style>
    </>
  );
}