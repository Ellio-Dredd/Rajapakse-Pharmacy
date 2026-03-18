import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router';
import logo from 'figma:asset/12f4788d231eeed58be516923f29125d458246af.png';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Rajapakse Pharmacy" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
              <span className="font-semibold text-foreground text-sm sm:text-base">Rajapakse Pharmacy</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Your trusted healthcare partner for medicines, medical devices, and professional consultations.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a href="#" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a href="#" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a href="#" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/products" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/doctors" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Doctors</Link></li>
              <li><Link to="/contact-us" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 text-xs sm:text-sm">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">0322247833</span>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground break-all">Rajapaksepharmacypvt@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">No.456, Kurunagala Road, Newtown Madampe</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2026 Rajapakse Pharmacy. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Made with ❤️ by SnackoverFlow
          </p>
        </div>
      </div>
    </footer>
  );
}