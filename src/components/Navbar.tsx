import { ShoppingCart, User, Upload } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onLoginClick?: () => void;
}

export function Navbar({ cartItemCount = 0, onCartClick, onLoginClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
                <circle cx="20" cy="10" r="2"></circle>
              </svg>
            </div>
            <span className="text-xl font-semibold text-foreground">HealthCare+</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Shop
            </a>
            <a href="#doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Doctors
            </a>
            <a href="#prescription" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Prescription
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onLoginClick}>
            <User className="h-4 w-4 mr-2" />
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
