// pages/api/chat/history.js
import { ObjectId } from 'mongodb';
import { getChatsCollection, getMessagesCollection } from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await authenticateRequest(req);
    const { chatId } = req.query;

    if (chatId) {
      // Get messages for specific chat
      const messages = await getMessagesCollection();
      const chatMessages = await messages
        .find({ chatId: new ObjectId(chatId) })
        .sort({ createdAt: 1 })
        .toArray();

      return res.json(
        chatMessages.map(msg => ({
          id: msg._id.toString(),
          chatId: msg.chatId.toString(),
          text: msg.text,
          isBot: msg.isBot,
          createdAt: msg.createdAt
        }))
      );
    } else {
      // Get all chats for user
      const chats = await getChatsCollection();
      const userChats = await chats
        .find({ userId: new ObjectId(decoded.id) })
        .sort({ updatedAt: -1 })
        .toArray();

      return res.json(
        userChats.map(chat => ({
          id: chat._id.toString(),
          chatName: chat.chatName,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }))
      );
    }

  } catch (error) {
    console.error('Get history error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
}