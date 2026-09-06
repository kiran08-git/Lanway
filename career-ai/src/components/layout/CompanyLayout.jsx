import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Building,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/company-dashboard', icon: LayoutDashboard },
  { label: 'Assessments', to: '/company-assessments', icon: ClipboardList },
  { label: 'Candidates', to: '/company-candidates', icon: Users },
  { label: 'Settings', to: '/company-settings', icon: Settings },
];

export default function CompanyLayout({ children, title, subtitle }) {
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

  const displayName = profile?.recruiter_name || 'Recruiter';
  const companyName = profile?.company_name || 'Company';
  const avatarInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <Link to="/company-dashboard" className="flex items-center gap-2.5 font-display font-bold text-[20px] text-brand-ink-900 px-2 mb-8">
        <Building className="h-7 w-7 text-brand-blue-600" />
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight truncate w-40">{companyName}</span>
          <span className="text-[10px] text-brand-ink-500 uppercase tracking-wider font-semibold">Hiring Portal</span>
        </div>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative ${isActive
                ? 'bg-brand-blue-50 text-brand-blue-600 before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-1 before:bg-brand-blue-600 before:rounded-r-md'
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
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-brand-ink-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 mt-auto"
      >
        <LogOut size={18} />
        {loggingOut ? 'Logging out...' : 'Log out'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-brand-ink-100 bg-white px-4 py-6 sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white px-4 py-6 shadow-2xl animate-fade-in">
            <button className="absolute right-4 top-4 text-brand-ink-500" onClick={() => setMobileOpen(false)}>
              <X size={22} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-brand-ink-100 shadow-sm">
          <div className="flex items-center justify-between h-[72px] px-5 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button className="lg:hidden text-brand-ink-600" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={22} />
              </button>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-xl text-brand-ink-900 truncate">{title}</h1>
                {subtitle && <p className="text-sm text-brand-ink-500 truncate mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              <button className="relative text-brand-ink-500 hover:text-brand-blue-600 transition-colors bg-brand-ink-50 p-2 rounded-full" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-brand-ink-50" />
              </button>
              
              <Link to="/company-settings" className="flex items-center gap-3 pl-2">
                <div className="h-10 w-10 rounded-full bg-brand-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-brand-blue-100">
                  {avatarInitials}
                </div>
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-brand-ink-800 leading-tight">{displayName}</span>
                    <span className="text-[11px] text-brand-ink-500">Recruiter</span>
                  </div>
                  <ChevronDown size={14} className="text-brand-ink-400 ml-1" />
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
