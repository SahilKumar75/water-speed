import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function getAllOnboardingData() {
  await connectDB();
  // Select all relevant fields for ML and analysis
  const users = await User.find({}, {
    onboardingData: 1,
    name: 1,
    email: 1,
    _id: 1,
    userType: 1,
    onboardingCompleted: 1
  }).lean();
  return users;
}
