// components/ChatList.js
export default function ChatList({ 
  chats, 
  currentChatId, 
  onChatSelect, 
  onChatDelete, 
  onNewChat 
}) {
  return (
    <>
      <div className="chat-list-container">
        <button className="new-chat-btn" onClick={onNewChat}>
          ➕ แชทใหม่
        </button>

        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีแชท</p>
              <small>กดปุ่มด้านบนเพื่อสร้างแชทใหม่</small>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              >
                <span 
                  className="chat-name"
                  onClick={() => onChatSelect(chat.id)}
                >
                  💬 {chat.chatName}
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatDelete(chat.id);
                  }}
                  title="ลบแชท"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-list-container {
          display: flex;
          flex-direction: column;
          height: 100%;
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
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
        }

        .new-chat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
        }

        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }

        .chat-list::-webkit-scrollbar {
          width: 6px;
        }

        .chat-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-state p {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .empty-state small {
          font-size: 12px;
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
          gap: 10px;
        }

        .chat-item:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .chat-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .chat-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          transition: all 0.2s;
        }

        .chat-item:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: #c0392b;
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}