import { ShoppingCart, User, Upload, LogOut, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import logo from 'figma:asset/12f4788d231eeed58be516923f29125d458246af.png';

interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onLoginClick?: () => void;
}

export function Navbar({ cartItemCount = 0, onCartClick, onLoginClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check user session and fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Set user from session immediately
          setUser({
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
          });

          // Try to fetch additional data from backend (optional)
          if (session.access_token) {
            try {
              const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-18234cd5/auth/me`,
                {
                  headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                  // Update user with backend data if available
                  setUser({
                    name: data.user.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                    email: data.user.email || session.user.email || '',
                  });
                }
              }
              // Silently ignore 401 errors from backend - we already have session data
            } catch (backendError) {
              // Backend fetch failed, but we already have session data, so continue
              console.log('Backend user fetch failed (using session data):', backendError);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        // Only log unexpected errors
        console.error('Unexpected error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
      setLoading(true);
      fetchUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      navigate('/cart');
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Rajapakse Pharmacy" className="h-10 w-10 object-contain" />
            <span className="text-xl font-semibold text-foreground">Rajapakse Pharmacy</span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigate('/products')}
              className={`text-sm transition-colors ${
                isActive('/products') 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Shop
            </button>
            {user && (
              <>
                <button 
                  onClick={() => navigate('/doctors')}
                  className={`text-sm transition-colors ${
                    isActive('/doctors') || location.pathname.startsWith('/doctor')
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Doctors
                </button>
                <button 
                  onClick={() => navigate('/prescription')}
                  className={`text-sm transition-colors inline-flex items-center gap-2 ${
                    isActive('/prescription') 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Upload Prescription
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          )}
          
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              <User className="h-4 w-4 mr-2" />
              Loading...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserCircle className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLoginClick}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}