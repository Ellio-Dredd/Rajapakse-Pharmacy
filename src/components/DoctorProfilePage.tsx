import { Star, Award, GraduationCap, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface DoctorProfilePageProps {
  onBookAppointment?: () => void;
}

export function DoctorProfilePage({ onBookAppointment }: DoctorProfilePageProps) {
  const doctor = {
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1632054226038-ed6997bfce1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBhc2lhbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAwMDU5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    experience: 15,
    rating: 4.9,
    reviews: 324,
    languages: ['English', 'Mandarin', 'Spanish'],
    education: [
      'MD - Harvard Medical School',
      'Fellowship in Cardiology - Johns Hopkins',
      'Board Certified - American Board of Internal Medicine',
    ],
    specialties: ['Heart Disease', 'Hypertension', 'Arrhythmia', 'Preventive Cardiology'],
    about: 'Dr. Michael Chen is a highly experienced cardiologist with over 15 years of practice. He specializes in treating various heart conditions and is known for his patient-centered approach to care. Dr. Chen has published numerous papers in peer-reviewed journals and is actively involved in medical education.',
  };

  const availableSlots = [
    { date: 'Mon, Feb 3', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'] },
    { date: 'Tue, Feb 4', slots: ['09:00 AM', '11:00 AM', '03:00 PM'] },
    { date: 'Wed, Feb 5', slots: ['10:00 AM', '01:30 PM', '04:00 PM'] },
    { date: 'Thu, Feb 6', slots: ['09:30 AM', '11:30 AM', '02:30 PM', '05:00 PM'] },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card */}
            <Card>
              <CardContent className="p-8">
                <div className="flex gap-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-32 w-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-2xl mb-1">{doctor.name}</h1>
                        <p className="text-lg text-muted-foreground">{doctor.specialization}</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">Available</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{doctor.experience} years exp.</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">New York Medical Center</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed">{doctor.about}</p>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education & Certifications
                </h3>
                <ul className="space-y-2">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{edu}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Available Slots */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Available Time Slots
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a convenient time for your appointment
                </p>

                <div className="space-y-4">
                  {availableSlots.map((day, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium mb-2">{day.date}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {day.slots.map((slot, slotIndex) => (
                          <Button
                            key={slotIndex}
                            variant="outline"
                            size="sm"
                            className="justify-start gap-2"
                            onClick={onBookAppointment}
                          >
                            <Clock className="h-3 w-3" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                      {index < availableSlots.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" size="lg" onClick={onBookAppointment}>
                  Book Appointment
                </Button>

                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Consultation Fee:</strong> $150
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
