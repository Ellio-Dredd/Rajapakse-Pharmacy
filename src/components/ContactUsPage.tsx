import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Message sent successfully!', {
      description: 'We\'ll get back to you within 24 hours.',
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '0322247833',
      subtext: 'Mon-Sat: 8:00 AM - 8:00 PM',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'Rajapaksepharmacypvt@gmail.com',
      subtext: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'No.456, Kurunagala Road',
      subtext: 'Newtown Madampe, Sri Lanka',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon-Sat: 8:00 AM - 8:00 PM',
      subtext: 'Sun: 9:00 AM - 6:00 PM',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have a question or need assistance? We're here to help. Reach out to us and 
              we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6 px-4 text-center">
                    <div className="h-14 w-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-sm text-foreground mb-1">{info.details}</p>
                    <p className="text-xs text-muted-foreground">{info.subtext}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl mb-6">Send Us a Message</h2>
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="0712345678"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl mb-6">Visit Our Store</h2>
                <Card className="border-none shadow-lg overflow-hidden">
                  <div className="h-80 bg-muted relative">
                    <img
                      src="https://images.unsplash.com/photo-1559305616-3b4d3b13912c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Store Location"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Rajapakse Pharmacy</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>No.456, Kurunagala Road, Newtown Madampe, Sri Lanka</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>0322247833</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Rajapaksepharmacypvt@gmail.com</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Section */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground mb-1">What are your delivery hours?</p>
                      <p className="text-muted-foreground">We deliver Monday to Saturday, 9:00 AM - 6:00 PM.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Do you accept prescriptions online?</p>
                      <p className="text-muted-foreground">Yes! You can upload prescriptions through our prescription upload page.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Can I consult with a doctor online?</p>
                      <p className="text-muted-foreground">Yes, we offer online doctor consultations. Visit our doctors page to book an appointment.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Banner */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl mb-3">Need Immediate Assistance?</h3>
            <p className="text-muted-foreground mb-6">
              For urgent medical queries or prescription-related emergencies, 
              please call us directly.
            </p>
            <Button size="lg" variant="default">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: 0322247833
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
