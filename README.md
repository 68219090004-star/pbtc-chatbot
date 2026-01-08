# 🎓 PBTC Chatbot - Powered by Google Gemini

AI Chatbot สำหรับ PBTC พัฒนาด้วย Next.js, MongoDB และ Google Gemini AI

## 🚀 ฟีเจอร์

### ✅ ระบบการเข้าสู่ระบบ
- 📝 สมัครสมาชิกใหม่
- 🔑 เข้าสู่ระบบ
- 🔐 JWT Token Authentication
- 👤 ข้อมูลโปรไฟล์ผู้ใช้

### ✅ ระบบแชท
- 💬 ส่งข้อความไปยัง AI (Google Gemini)
- 📝 ประวัติแชท
- 📁 สร้างแชทใหม่ได้หลายชุด
- 🗑️ ลบแชทรายบุคคล
- ⏱️ บันทึกเวลา

### ✅ ระบบ AI
- 🤖 Google Gemini 2.0 Flash
- ⚡ ตอบเร็ว (2-10 วินาที)
- 🇹🇭 รองรับภาษาไทย

### ✅ ระบบอื่นๆ
- 📱 Responsive Design
- 🖥️ ตรวจจับอุปกรณ์
- 🎨 UI/UX สวยงาม

---

## 📦 การติดตั้ง

### 1. Clone โปรเจค
```bash
git clone https://github.com/yourusername/pbtc-chatbot.git
cd pbtc-chatbot
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pbtc-chatbot
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=AIzaSyDfPQaQZ8Df7QjlQ2soca0TR_86E_Fxb7Y
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 4. รันโปรเจค
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

---

## 🌐 Deploy บน Vercel

### 1. ติดตั้ง Vercel CLI
```bash
npm install -g vercel
```

### 2. Login Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. ตั้งค่า Environment Variables ใน Vercel Dashboard
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

---

## 📁 โครงสร้างโปรเจค

```
pbtc-chatbot/
├── pages/
│   ├── index.js          # หน้าแชทหลัก
│   ├── login.js          # หน้า Login
│   ├── register.js       # หน้า Register
│   └── api/
│       ├── auth/
│       │   ├── login.js
│       │   ├── register.js
│       │   └── profile.js
│       └── chat/
│           ├── new.js
│           ├── history.js
│           ├── delete.js
│           └── gemini.js
├── lib/
│   ├── db.js             # MongoDB Connection
│   └── auth.js           # JWT Helper
├── .env.local            # Environment Variables
├── next.config.js
├── vercel.json
├── package.json
└── README.md
```

---

## 🗄️ Database (MongoDB)

### Collections:

**users**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**chats**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  chatName: String,
  createdAt: Date,
  updatedAt: Date
}
```

**messages**
```javascript
{
  _id: ObjectId,
  chatId: ObjectId,
  userId: ObjectId,
  text: String,
  isBot: Boolean,
  createdAt: Date
}
```

---

## 🛡️ ความปลอดภัย

- ✅ Password Hashing (bcrypt)
- ✅ JWT Authentication
- ✅ Environment Variables
- ✅ CORS Configuration

---

## 🤖 Google Gemini API

ใช้ Google Gemini 2.0 Flash API:
- Model: `gemini-2.0-flash-exp`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/`
- API Key: ตั้งค่าใน `.env.local`

---

## 📝 สคริปต์

```bash
npm run dev      # รันโหมด Development
npm run build    # Build สำหรับ Production
npm run start    # รัน Production
npm run lint     # ตรวจสอบโค้ด
```

---

## 🆘 การแก้ปัญหา

### ❌ Database connection error
- ตรวจสอบ `MONGODB_URI` ใน `.env.local`
- ตรวจสอบว่า IP Address อนุญาตใน MongoDB Atlas

### ❌ JWT error
- ตรวจสอบ `JWT_SECRET` ใน `.env.local`
- สร้าง JWT Secret ใหม่: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### ❌ Gemini API error
- ตรวจสอบ `GEMINI_API_KEY` ใน `.env.local`
- ตรวจสอบว่า API Key ใช้งานได้

---

## 📞 ติดต่อ

- GitHub: https://github.com/yourusername/pbtc-chatbot
- Email: your@email.com

---

## 📄 License

MIT License

---

## 🎉 ขอบคุณ

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Google Gemini](https://ai.google.dev/)
- [Vercel](https://vercel.com/)

---

**Made with ❤️ by PBTC Team**