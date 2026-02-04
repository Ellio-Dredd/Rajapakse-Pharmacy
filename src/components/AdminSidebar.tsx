import { Home, Package, ShoppingBag, Users, Calendar, FileText, BarChart3, Settings, LogOut, Tag, Menu, X, Stethoscope } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import logo from 'figma:asset/12f4788d231eeed58be516923f29125d458246af.png';
import { useState } from 'react';
import { Button } from './ui/button';

interface AdminSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function AdminSidebar({ activePage, onNavigate }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Rajapakse Pharmacy" className="h-10 w-10 object-contain" />
          <div>
            <h2 className="font-semibold">Rajapakse Pharmacy</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r z-40 transform transition-transform lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-card border-r">
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}