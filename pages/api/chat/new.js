// pages/api/chat/new.js
import { ObjectId } from 'mongodb';
import { getChatsCollection } from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await authenticateRequest(req);
    const { chatName } = req.body;

    const chats = await getChatsCollection();

    const result = await chats.insertOne({
      userId: new ObjectId(decoded.id),
      chatName: chatName || 'แชทใหม่',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      id: result.insertedId.toString(),
      chatName: chatName || 'แชทใหม่',
      createdAt: new Date()
    });

  } catch (error) {
    console.error('Create chat error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
}