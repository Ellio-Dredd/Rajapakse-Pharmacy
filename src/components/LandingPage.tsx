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
      image: 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcGlsbHMlMjBtZWRpY2luZSUyMHBoYXJtYWN5fGVufDF8fHx8MTc3MDA1MjcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'bg-blue-50',
    },
    {
      title: 'Medical Devices',
      description: 'Quality healthcare equipment',
      image: 'https://images.unsplash.com/photo-1763070282912-08b63e2eb427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZGV2aWNlJTIwaGVhbHRoY2FyZSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzAwNTI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'bg-teal-50',
    },
    {
      title: 'Wellness',
      description: 'Vitamins & supplements',
      image: 'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHZpdGFtaW5zJTIwc3VwcGxlbWVudHN8ZW58MXx8fHwxNzcwMDUyNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'bg-green-50',
    },
    {
      title: 'Personal Care',
      description: 'Hygiene & wellness products',
      image: 'https://images.unsplash.com/photo-1760184762833-7c6bd9ef1415?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBoeWdpZW5lJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzcwMDUyNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Quality medicines, expert consultations, and healthcare products delivered to your doorstep.
                Experience convenient healthcare like never before.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => onNavigate?.('products')}>
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate?.('doctors')}>
                  Find a Doctor
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758691462848-ba1e929da259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwbWVkaWNhbCUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NzAwNTI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthcare Professional"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">Featured Categories</h2>
            <p className="text-muted-foreground">Browse through our wide range of healthcare products</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => onNavigate?.('products')}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl mb-1">{category.title}</h3>
                      <p className="text-sm text-white/90">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-cyan-600">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <h2 className="text-3xl mb-4">Get 20% Off on Your First Order</h2>
                  <p className="text-white/90 mb-6">
                    Sign up today and enjoy exclusive discounts on medicines and healthcare products.
                  </p>
                  <Button size="lg" variant="secondary">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1758691463203-cce9d415b2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMGRpZ2l0YWwlMjBoZWFsdGh8ZW58MXx8fHwxNzcwMDE1MTgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Promotion"
                    className="rounded-xl w-full h-full object-cover"
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
