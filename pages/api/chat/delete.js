// pages/api/chat/delete.js
import { ObjectId } from 'mongodb';
import { getChatsCollection, getMessagesCollection } from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await authenticateRequest(req);
    const { chatId } = req.query;

    if (!chatId) {
      return res.status(400).json({ error: 'กรุณาระบุ chatId' });
    }

    const chats = await getChatsCollection();
    const messages = await getMessagesCollection();

    // Delete chat
    const result = await chats.deleteOne({
      _id: new ObjectId(chatId),
      userId: new ObjectId(decoded.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'ไม่พบแชท' });
    }

    // Delete all messages in this chat
    await messages.deleteMany({ chatId: new ObjectId(chatId) });

    res.json({ message: 'ลบแชทสำเร็จ' });

  } catch (error) {
    console.error('Delete chat error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
}