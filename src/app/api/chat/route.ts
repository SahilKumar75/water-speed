import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Chat from '@/models/Chat';

// Save chat history
export async function POST(req: Request) {
  const { userId, sessionId, messages } = await req.json();
  await connectDB();
  // Upsert chat history for user or session
  await Chat.findOneAndUpdate(
    { $or: [ { userId }, { sessionId } ] },
    { userId, sessionId, messages, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  return NextResponse.json({ success: true });
}

// Fetch chat history
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const sessionId = searchParams.get('sessionId');
  await connectDB();
  const chat = await Chat.findOne({ $or: [ { userId }, { sessionId } ] });
  return NextResponse.json({ messages: chat?.messages || [] });
}
