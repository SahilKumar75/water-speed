import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // ✅ CRITICAL FIX: Handle empty or malformed JSON gracefully
    let requestData;
    
    try {
      // Check if request has a body before parsing
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json({ 
          error: 'Invalid Content-Type. Expected application/json' 
        }, { status: 400 });
      }

      requestData = await request.json();
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError);
      return NextResponse.json({ 
        error: 'Invalid JSON format in request body' 
      }, { status: 400 });
    }

    const { userId, onboardingData } = requestData;

    // Validate required fields
    if (!userId || !onboardingData) {
      return NextResponse.json({ 
        error: 'Missing userId or onboardingData' 
      }, { status: 400 });
    }

    // ✅ FIXED: Authorization token handling
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'No authorization token provided' 
      }, { status: 401 });
    }

    // ✅ FIXED: Get token at index [1], not 
    const token = authHeader.split(' ')[1];
    
    if (!token || token.trim() === '') {
      return NextResponse.json({ 
        error: 'Empty token provided' 
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (jwtError) {
      console.error('❌ JWT Error:', jwtError);
      return NextResponse.json({ 
        error: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    if (decoded.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Connect to MongoDB
    await connectDB();

    // Update user with onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          onboardingCompleted: true,
          onboardingData: {
            ...onboardingData,
            completedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Data saved successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}