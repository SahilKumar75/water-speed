import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  console.log('🔄 Registration attempt started');
  
  try {
    const body = await request.json();
    console.log('📝 Received request body:', body);
    
    const { name, email, password, userType, organizationName } = body;
    
    // Manual validation before Mongoose
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    if (!userType || !['personal', 'organization'].includes(userType)) {
      return NextResponse.json(
        { error: 'Valid user type is required' },
        { status: 400 }
      );
    }
    
    if (userType === 'organization' && (!organizationName || organizationName.trim() === '')) {
      return NextResponse.json(
        { error: 'Organization name is required for organization accounts' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('✅ Database connected successfully');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hashed successfully');

    // Create user data
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      userType,
      ...(userType === 'organization' && { organizationName: organizationName.trim() }),
    };

    console.log('📄 Creating user with data:', {
      ...userData,
      password: '[HASHED]'
    });

    // Save user to database
    const user = await User.create(userData);
    console.log('✅ User saved successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('🎫 JWT token created successfully');

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        organizationName: user.organizationName,
      },
    });
    
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
