import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('location', (msg) => {
  const chatId = msg.chat.id;
  const location = msg.location;
  
  io.emit('locationUpdate', {
    id: chatId.toString(),
    lat: location.latitude,
    lng: location.longitude
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});