// pages/api/auth/register.js
import bcrypt from 'bcryptjs';
import { getUsersCollection } from '../../../lib/db';
import { signToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    const users = await getUsersCollection();

    // Check if email exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    // Check if username exists
    const existingUsername = await users.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await users.insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const user = {
      id: result.insertedId.toString(),
      username,
      email
    };

    // Generate JWT
    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' });
  }
}