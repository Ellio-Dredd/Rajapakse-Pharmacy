import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ProductsPage } from './components/ProductsPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { PrescriptionUploadPage } from './components/PrescriptionUploadPage';
import { DoctorsListingPage } from './components/DoctorsListingPage';
import { DoctorProfilePage } from './components/DoctorProfilePage';
import { AppointmentBookingPage } from './components/AppointmentBookingPage';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboardHome } from './components/AdminDashboardHome';
import { AdminProductManagement } from './components/AdminProductManagement';
import { AdminOrderManagement } from './components/AdminOrderManagement';
import { AdminUserManagement } from './components/AdminUserManagement';
import { AdminAppointmentManagement } from './components/AdminAppointmentManagement';
import { SeedDatabaseButton } from './components/SeedDatabaseButton';
import { Button } from './components/ui/button';
import { Shield, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
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

  const renderCustomerPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'products':
        return <ProductsPage onAddToCart={handleAddToCart} />;
      case 'cart':
        return (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => setCurrentPage('checkout')}
          />
        );
      case 'checkout':
        return <CheckoutPage onPlaceOrder={() => setCurrentPage('landing')} />;
      case 'prescription':
        return <PrescriptionUploadPage />;
      case 'doctors':
        return <DoctorsListingPage onBookAppointment={() => setCurrentPage('doctor-profile')} />;
      case 'doctor-profile':
        return <DoctorProfilePage onBookAppointment={() => setCurrentPage('appointment-booking')} />;
      case 'appointment-booking':
        return <AppointmentBookingPage />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  const renderAdminPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'products':
        return <AdminProductManagement />;
      case 'orders':
        return <AdminOrderManagement />;
      case 'users':
        return <AdminUserManagement />;
      case 'appointments':
        return <AdminAppointmentManagement />;
      default:
        return <AdminDashboardHome />;
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-background">
        <AdminSidebar activePage={currentPage} onNavigate={setCurrentPage} />
        <div className="lg:pl-64">
          <div className="border-b bg-white">
            <div className="flex h-16 items-center justify-between px-6">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdminMode(false);
                  setCurrentPage('landing');
                }}
              >
                Exit Admin Mode
              </Button>
            </div>
          </div>
          <main className="p-6">
            {renderAdminPage()}
          </main>
        </div>
        <Toaster />
      </div>
    );
  }

  // Setup page for first-time users
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold mb-2">Welcome to HealthCare+</h1>
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
        onCartClick={() => setCurrentPage('cart')}
        onLoginClick={() => alert('Login functionality')}
      />
      <main className="flex-1">
        {renderCustomerPage()}
      </main>
      <Footer />
      
      {/* Admin Mode Toggle Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        size="icon"
        onClick={() => {
          setIsAdminMode(true);
          setCurrentPage('dashboard');
        }}
        title="Admin Panel"
      >
        <Shield className="h-6 w-6" />
      </Button>
      
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