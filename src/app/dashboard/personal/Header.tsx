import { Wind } from 'lucide-react';

interface HeaderProps {
  user: { name: string } | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Wind className="w-8 h-8 text-green-400" />
            <span className="text-white font-bold text-xl">Wind Speed</span>
          </a>
        </div>
        <button
          onClick={onLogout}
          className="text-white/70 hover:text-white text-sm transition-colors"
        >
          Skip Setup
        </button>
      </div>
    </nav>
  );
}
