import mongoose, { Schema, models, model } from 'mongoose';

const ChatSchema = new Schema({
  userId: { type: String, default: null },
  sessionId: { type: String, default: null },
  messages: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Chat || model('Chat', ChatSchema);
