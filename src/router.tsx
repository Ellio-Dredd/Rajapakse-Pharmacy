import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useOutletContext, Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ProductsPage } from './components/ProductsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { PrescriptionUploadPage } from './components/PrescriptionUploadPage';
import { DoctorsListingPage } from './components/DoctorsListingPage';
import { DoctorProfilePage } from './components/DoctorProfilePage';
import { AppointmentBookingPage } from './components/AppointmentBookingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboardHome } from './components/AdminDashboardHome';
import { AdminProductManagement } from './components/AdminProductManagement';
import { AdminCategoryManagement } from './components/AdminCategoryManagement';
import { AdminOrderManagement } from './components/AdminOrderManagement';
import { AdminUserManagement } from './components/AdminUserManagement';
import { AdminAppointmentManagement } from './components/AdminAppointmentManagement';
import { AdminReports } from './components/AdminReports';
import { AdminSettings } from './components/AdminSettings';
import { SeedDatabaseButton } from './components/SeedDatabaseButton';
import { Button } from './components/ui/button';
import { Shield, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { toast } from 'sonner';

// Type for the customer context
type CustomerContextType = {
  cartItems: any[];
  handleAddToCart: (product: any) => void;
  handleUpdateQuantity: (id: number, quantity: number) => void;
  handleRemoveItem: (id: number) => void;
};

// Protected Route Component - Redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          toast.error('Please login to access this page');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}

// Customer Layout with Navbar and Footer
function CustomerLayout() {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Paracetamol 500mg - 20 Tablets',
      price: 5.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcGlsbHMlMjBtZWRpY2luZSUyMHBoYXJtYWN5fGVufDF8fHx8MTc3MDA1MjcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Digital Blood Pressure Monitor',
      price: 49.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1763070282912-08b63e2eb427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZGV2aWNlJTIwaGVhbHRoY2FyZSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzAwNTI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ]);

  // Check if current user is admin
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          // Query the users table directly to get role
          const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          console.log('User role check:', { userId: session.user.id, role: userData?.role, error: dbError });

          if (!dbError && userData?.role === 'admin') {
            setIsAdmin(true);
            console.log('User is admin!');
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsAdmin(false);
      }
    };

    checkUserRole();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Setup modal
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold mb-2">Welcome to Rajapakse Pharmacy</h1>
            <p className="text-muted-foreground">
              Initialize your database to get started with sample products, doctors, and more
            </p>
          </div>
          
          <SeedDatabaseButton />
          
          <div className="text-center">
            <Button variant="ghost" onClick={() => setShowSetup(false)}>
              Skip Setup (Use Demo Data)
            </Button>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => navigate('/cart')}
      />
      <main className="flex-1">
        <Outlet context={{ cartItems, handleAddToCart, handleUpdateQuantity, handleRemoveItem }} />
      </main>
      <Footer />
      
      {/* Admin Mode Toggle Button - Only show for admin users */}
      {isAdmin && (
        <Button
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
          size="icon"
          onClick={() => navigate('/admin')}
          title="Admin Panel"
        >
          <Shield className="h-6 w-6" />
        </Button>
      )}
      
      {/* Setup Button */}
      <Button
        className="fixed bottom-6 right-24 rounded-full h-14 w-14 shadow-lg z-50"
        size="icon"
        variant="outline"
        onClick={() => setShowSetup(true)}
        title="Database Setup"
      >
        <Settings className="h-6 w-6" />
      </Button>
      
      <Toaster />
    </div>
  );
}

// Admin Layout with Sidebar
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract current admin page from pathname
  const getActivePage = () => {
    const path = location.pathname.split('/')[2]; // /admin/[page]
    return path || 'dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        activePage={getActivePage()} 
        onNavigate={(page) => navigate(`/admin/${page}`)} 
      />
      <div className="lg:pl-64">
        <div className="border-b bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              Exit Admin Mode
            </Button>
          </div>
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

// Wrapper components for each route to properly handle context and navigation
function LandingPageRoute() {
  const navigate = useNavigate();
  return <LandingPage onNavigate={(page) => navigate(`/${page}`)} />;
}

function ProductsPageRoute() {
  const { handleAddToCart } = useOutletContext<CustomerContextType>();
  return <ProductsPage onAddToCart={handleAddToCart} />;
}

function ProductDetailPageRoute() {
  const { handleAddToCart } = useOutletContext<CustomerContextType>();
  return <ProductDetailPage onAddToCart={handleAddToCart} />;
}

function CartPageRoute() {
  const navigate = useNavigate();
  const { cartItems, handleUpdateQuantity, handleRemoveItem } = useOutletContext<CustomerContextType>();
  return (
    <CartPage 
      items={cartItems} 
      onUpdateQuantity={handleUpdateQuantity} 
      onRemoveItem={handleRemoveItem} 
      onCheckout={() => navigate('/checkout')} 
    />
  );
}

function CheckoutPageRoute() {
  const navigate = useNavigate();
  return <CheckoutPage onPlaceOrder={() => navigate('/')} />;
}

function DoctorsListingPageRoute() {
  const navigate = useNavigate();
  return <DoctorsListingPage onBookAppointment={(doctorId?: string) => {
    if (doctorId) {
      navigate(`/doctor/${doctorId}`);
    } else {
      navigate('/doctor-profile');
    }
  }} />;
}

function DoctorProfilePageRoute() {
  const navigate = useNavigate();
  return <DoctorProfilePage onBookAppointment={() => navigate('/appointment-booking')} />;
}

// Export the main router component
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<LandingPageRoute />} />
          <Route path="products" element={<ProductsPageRoute />} />
          <Route path="product/:id" element={<ProductDetailPageRoute />} />
          <Route path="cart" element={<ProtectedRoute><CartPageRoute /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><CheckoutPageRoute /></ProtectedRoute>} />
          <Route path="prescription" element={<ProtectedRoute><PrescriptionUploadPage /></ProtectedRoute>} />
          <Route path="doctors" element={<ProtectedRoute><DoctorsListingPageRoute /></ProtectedRoute>} />
          <Route path="doctor/:id" element={<ProtectedRoute><DoctorProfilePageRoute /></ProtectedRoute>} />
          <Route path="doctor-profile" element={<ProtectedRoute><DoctorProfilePageRoute /></ProtectedRoute>} />
          <Route path="appointment-booking" element={<ProtectedRoute><AppointmentBookingPage /></ProtectedRoute>} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardHome />} />
          <Route path="products" element={<AdminProductManagement />} />
          <Route path="categories" element={<AdminCategoryManagement />} />
          <Route path="orders" element={<AdminOrderManagement />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="appointments" element={<AdminAppointmentManagement />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}