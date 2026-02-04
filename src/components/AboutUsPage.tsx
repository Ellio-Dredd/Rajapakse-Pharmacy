import { Heart, Award, Users, Shield, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function AboutUsPage() {
  const values = [
    {
      icon: Heart,
      title: 'Patient-Centric Care',
      description: 'We put your health and well-being at the center of everything we do.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: '100% authentic products sourced from trusted manufacturers.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Secure transactions and verified medical professionals.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Certified pharmacists and healthcare professionals ready to help.',
    },
  ];

  const milestones = [
    { year: '1995', event: 'Rajapakse Pharmacy was founded' },
    { year: '2005', event: 'Expanded to medical devices and equipment' },
    { year: '2015', event: 'Launched doctor consultation services' },
    { year: '2025', event: 'Introduced online platform for seamless healthcare' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">About Rajapakse Pharmacy</h1>
            <p className="text-lg text-muted-foreground">
              For over 30 years, we've been your trusted healthcare partner, delivering quality medicines, 
              medical devices, and professional consultations to communities across Sri Lanka.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1995, Rajapakse Pharmacy began as a small community pharmacy in Madampe, 
                  with a simple mission: to provide accessible, quality healthcare to everyone.
                </p>
                <p>
                  Over the decades, we've grown into a comprehensive healthcare platform, offering 
                  thousands of products, medical equipment, and professional consultations - while 
                  staying true to our core values of trust, quality, and compassionate care.
                </p>
                <p>
                  Today, we combine the warmth of personalized service with modern technology, 
                  making healthcare more convenient and accessible than ever before.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Pharmacy Team"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6 px-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">Our Journey</h2>
            <p className="text-muted-foreground">Key milestones in our history</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-lg text-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-3">Visit Our Store</h2>
              <p className="text-muted-foreground">We're here to serve you</p>
            </div>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Address</h4>
                        <p className="text-muted-foreground">
                          No.456, Kurunagala Road<br />
                          Newtown Madampe<br />
                          Sri Lanka
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Opening Hours</h4>
                        <p className="text-muted-foreground">
                          Monday - Saturday: 8:00 AM - 8:00 PM<br />
                          Sunday: 9:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-64 md:h-auto rounded-lg overflow-hidden bg-muted">
                    <img
                      src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Pharmacy Store Front"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <div className="text-muted-foreground">Years of Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Healthcare Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Satisfied Customers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
