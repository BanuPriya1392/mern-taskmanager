import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 text-slate-100 px-6 py-4 flex justify-between items-center bg-slate-900/40 border-b border-slate-800/80">
      <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
        <span className="text-2xl">⚡</span> TaskFlow
      </h1>
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-200">{user.name}</span>
            <span className="text-xs text-indigo-400">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm px-4 py-1.5 rounded-lg border-red-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}