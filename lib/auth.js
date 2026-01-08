// lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.SESSION_EXPIRE || '7d'
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  return token;
}

export async function authenticateRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }

  return decoded;
}