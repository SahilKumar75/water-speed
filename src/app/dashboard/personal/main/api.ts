// API helpers for dashboard
export async function fetchUserProfile(token: string) {
  const res = await fetch('/api/user/profile', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function saveOnboarding(token: string, userId: string, onboardingData: any) {
  const payload = { userId, onboardingData };
  const res = await fetch('/api/user/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function sendChatMessage(onboardingData: any, message: string) {
  const res = await fetch('/api/ml/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboardingData, message }),
  });
  if (!res.ok) throw new Error('Failed to get suggestion');
  return res.json();
}
