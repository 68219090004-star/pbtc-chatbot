// components/Navbar.js
import { useState } from 'react';

export default function Navbar({ user, onMenuClick, onLogout }) {
  return (
    <>
      <nav className="navbar">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <div className="navbar-title">PBTC Chatbot</div>
        <div className="navbar-right">
          <div className="ai-badge">🤖 Gemini 2.0</div>
          {user && (
            <div className="user-menu">
              <div className="user-avatar">
                {user.username?.[0]?.toUpperCase() || '👤'}
              </div>
              <button className="logout-btn-small" onClick={onLogout}>
                🚪
              </button>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          padding: 15px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .menu-btn {
          display: none;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .menu-btn {
            display: block;
          }
        }

        .navbar-title {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ai-badge {
          background: rgba(255, 215, 0, 0.3);
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .logout-btn-small {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .logout-btn-small:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}