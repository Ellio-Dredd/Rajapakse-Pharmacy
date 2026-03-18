import { ArrowRight, Package, Stethoscope, Heart, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const categories = [
    {
      title: 'Medicines',
      description: 'Prescription & OTC medications',
      image: 'https://images.unsplash.com/photo-1758345680670-20a895a2dba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwY2Fwc3VsZXMlMjBwaGFybWFjeSUyMHByZXNjcmlwdGlvbnxlbnwxfHx8fDE3NzM4NTM4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'bg-blue-50',
    },
    {
      title: 'Medical Devices',
      description: 'Quality healthcare equipment',
      image: 'https://images.unsplash.com/photo-1766325693728-348c38374d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZGV2aWNlcyUyMHN0ZXRob3Njb3BlJTIwYmxvb2QlMjBwcmVzc3VyZSUyMG1vbml0b3J8ZW58MXx8fHwxNzczODUzODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'bg-teal-50',
    },
    {
      title: 'Wellness',
      description: 'Vitamins & supplements',
      image: 'https://images.unsplash.com/photo-1556739664-787e863d09c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWlucyUyMHN1cHBsZW1lbnRzJTIwYm90dGxlcyUyMGhlYWx0aGNhcmUlMjBudXRyaXRpb258ZW58MXx8fHwxNzczODUzODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'bg-green-50',
    },
    {
      title: 'Personal Care',
      description: 'Hygiene & wellness products',
      image: 'https://images.unsplash.com/photo-1611072965169-e1534f6f300c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwY29zbWV0aWNzJTIwcGhhcm1hY3klMjBzaGVsdmVzfGVufDF8fHx8MTc3Mzg1MzgyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'bg-purple-50',
    },
  ];

  const features = [
    {
      icon: Package,
      title: 'Wide Selection',
      description: 'Over 10,000+ healthcare products',
    },
    {
      icon: Stethoscope,
      title: 'Expert Doctors',
      description: 'Consult with certified professionals',
    },
    {
      icon: Heart,
      title: 'Trusted Quality',
      description: ' 100% authentic products',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your health data is protected',
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">
                Your Health, Our Priority
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                Quality medicines, expert consultations, and healthcare products delivered to your doorstep.
                Experience convenient healthcare like never before.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button size="lg" onClick={() => onNavigate?.('products')} className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate?.('doctors')} className="w-full sm:w-auto">
                  Find a Doctor
                </Button>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1618053448748-b7251851d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHBoYXJtYWNpc3QlMjBjaGVtaXN0JTIwbWVkaWNhbCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM4NTM4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Healthcare Professional"
                className="rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">Featured Categories</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Browse through our wide range of healthcare products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => onNavigate?.('products')}
              >
                <CardContent className="p-0">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                      <h3 className="text-lg sm:text-xl mb-0.5 sm:mb-1">{category.title}</h3>
                      <p className="text-xs sm:text-sm text-white/90">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h4 className="mb-1 sm:mb-2 text-base sm:text-lg">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground px-2">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-cyan-600">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="text-white text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">Get 20% Off on Your First Order</h2>
                  <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base">
                    Sign up today and enjoy exclusive discounts on medicines and healthcare products.
                  </p>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="w-full sm:w-auto"
                    onClick={() => onNavigate?.('products')}
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="relative h-48 sm:h-64 md:h-72 lg:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1655809356482-6a0d443ed5ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMGRpc2NvdW50JTIwc2FsZSUyMHNob3BwaW5nJTIwY29sb3JmdWwlMjBtZWRpY2luZSUyMGJvdHRsZXN8ZW58MXx8fHwxNzczODU1NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Promotion"
                    className="rounded-lg sm:rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}