import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// ✅ Prevent static optimization that can cause 405 errors
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('🔍 POST /api/user/onboarding called');
  
  try {
  const { userId, onboardingData } = await request.json();
  console.log('🔍 Received userId:', userId);
  console.log('🔍 Received onboardingData:', JSON.stringify(onboardingData));

    // Verify authorization token
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Auth header:', authHeader); // Debug log
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    // ✅ FIXED: Use index [1] instead of [14]
    const token = authHeader.split(' ')[1];
    console.log('🔍 Token extracted:', !!token); // Debug log
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      console.log('✅ Token verified for user:', decoded.userId);
    } catch (jwtError) {
      console.error('❌ JWT Error:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (decoded.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Connect to MongoDB
    await connectDB();

    // Update user with onboarding data
    let updatedUser = null;
    try {
      updatedUser = await User.findByIdAndUpdate(
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
      console.log('🔍 MongoDB update result:', updatedUser);
    } catch (err) {
      console.error('❌ MongoDB update error:', err);
    }

    if (!updatedUser) {
      console.error('❌ User not found or update failed for userId:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ Onboarding data saved successfully for userId:', userId);

    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        onboardingCompleted: updatedUser.onboardingCompleted
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
