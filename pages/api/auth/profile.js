// pages/api/auth/profile.js
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const decoded = await authenticateRequest(req);

    const users = await getUsersCollection();
    const user = await users.findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    res.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Profile error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
}