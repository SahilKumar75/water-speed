import React from 'react';
import { useRouter } from 'next/navigation';

const SidePanel: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens, call API)
    router.push('/auth/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-56 glass flex flex-col z-50" style={{ boxShadow: 'none' }}>
      <div className="flex flex-col items-center py-10 gap-8">
        <button
          className="w-full py-3 px-5 rounded-xl hover:bg-[#c0e57b]/30 text-[#224b32] font-semibold text-left transition-colors"
          onClick={() => router.push('/')}
        >
          Home
        </button>
        <button
          className="w-full py-3 px-5 rounded-xl hover:bg-red-100 text-red-700 font-semibold text-left transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidePanel;
