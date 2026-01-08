// pages/api/chat/gemini.js
import { ObjectId } from 'mongodb';
import { getMessagesCollection, getChatsCollection } from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await authenticateRequest(req);
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'กรุณาระบุ chatId และ message' });
    }

    const messages = await getMessagesCollection();
    const chats = await getChatsCollection();

    // Save user message
    await messages.insertOne({
      chatId: new ObjectId(chatId),
      userId: new ObjectId(decoded.id),
      text: message,
      isBot: false,
      createdAt: new Date()
    });

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      throw new Error('Gemini API error');
    }

    const data = await geminiResponse.json();
    const botMessage = data.candidates[0].content.parts[0].text;

    // Save bot message
    await messages.insertOne({
      chatId: new ObjectId(chatId),
      userId: new ObjectId(decoded.id),
      text: botMessage,
      isBot: true,
      createdAt: new Date()
    });

    // Update chat timestamp
    await chats.updateOne(
      { _id: new ObjectId(chatId) },
      { $set: { updatedAt: new Date() } }
    );

    res.json({ message: botMessage });

  } catch (error) {
    console.error('Gemini API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
    }
    res.status(500).json({ 
      error: 'ไม่สามารถเชื่อมต่อ Gemini AI ได้ กรุณาตรวจสอบ API Key' 
    });
  }
}