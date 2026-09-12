import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  User,
  ClipboardList,
  Sparkles,
  Map,
  Briefcase,
  GraduationCap,
  Target,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { currentUser } from '../../data/mockData';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Assistant', to: '/chat', icon: Bot },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Assessment', to: '/assessment', icon: ClipboardList },
  { label: 'Career Matches', to: '/careers', icon: Sparkles },
  { label: 'Learning Roadmap', to: '/roadmap', icon: Map },
  { label: 'Free Courses', to: '/courses', icon: GraduationCap },
  { label: 'Opportunities', to: '/opportunities', icon: Briefcase },
];

export default function DashboardLayout({ children, title, subtitle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout, profile } = useAuth();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const displayName = profile?.name || currentUser.name;
  const avatarInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <Link to="/dashboard" className="flex items-center gap-2.5 font-display font-bold text-[20px] text-brand-ink-900 px-2 mb-8">
        <img src="/logo.png" alt="Lanway Logo" className="h-9 w-auto object-contain shrink-0" style={{ imageRendering: 'high-quality' }} />
        Lanway
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative ${isActive
                ? 'bg-brand-blue-50 text-brand-blue-700 before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-1 before:bg-brand-blue-600 before:rounded-r-md'
                : 'text-brand-ink-500 hover:bg-brand-ink-50 hover:text-brand-ink-900'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-brand-ink-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        <LogOut size={18} />
        {loggingOut ? 'Logging out...' : 'Log out'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfaf8] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-brand-ink-200 bg-[#fbfaf8] px-4 py-6 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#fbfaf8] px-4 py-6 shadow-2xl animate-fade-in">
            <button className="absolute right-4 top-4 text-brand-ink-500" onClick={() => setMobileOpen(false)}>
              <X size={22} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#fbfaf8]/95 backdrop-blur-md border-b border-brand-ink-200">
          <div className="flex items-center justify-between h-[72px] px-5 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button className="lg:hidden text-brand-ink-600" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={22} />
              </button>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-xl text-brand-ink-900 truncate">{title}</h1>
                {subtitle && <p className="text-sm text-brand-ink-500 truncate">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              <button className="relative text-brand-ink-500 hover:text-brand-blue-600 transition-colors" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand-blue-500 border-2 border-white" />
              </button>
              
              <Link to="/profile" className="flex items-center gap-3 pl-2">
                <div className="h-9 w-9 rounded-full bg-brand-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {avatarInitials}
                </div>
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <span className="text-sm font-medium text-brand-ink-800">{displayName}</span>
                  <ChevronDown size={14} className="text-brand-ink-400" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 lg:px-8 py-7 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
