import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { DoctorCard } from './DoctorCard';

interface DoctorsListingPageProps {
  onBookAppointment?: (doctor: any) => void;
}

export function DoctorsListingPage({ onBookAppointment }: DoctorsListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Michael Chen',
      specialization: 'Cardiologist',
      experience: 15,
      rating: 4.9,
      reviews: 324,
      image: 'https://images.unsplash.com/photo-1632054226038-ed6997bfce1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBhc2lhbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAwMDU5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      category: 'cardiology',
    },
    {
      id: 2,
      name: 'Dr. Sarah Williams',
      specialization: 'Pediatrician',
      experience: 12,
      rating: 4.8,
      reviews: 267,
      image: 'https://images.unsplash.com/photo-1632054224477-c9cb3aae1b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwMDUyODMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      category: 'pediatrics',
    },
    {
      id: 3,
      name: 'Dr. James Anderson',
      specialization: 'General Physician',
      experience: 20,
      rating: 4.7,
      reviews: 512,
      image: 'https://images.unsplash.com/photo-1575654402720-0af3480d1fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MDA1MjgzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      category: 'general',
    },
    {
      id: 4,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatologist',
      experience: 10,
      rating: 4.9,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1632054224477-c9cb3aae1b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwMDUyODMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      category: 'dermatology',
    },
    {
      id: 5,
      name: 'Dr. Robert Kim',
      specialization: 'Orthopedic Surgeon',
      experience: 18,
      rating: 4.8,
      reviews: 445,
      image: 'https://images.unsplash.com/photo-1632054226038-ed6997bfce1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBhc2lhbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzAwMDU5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      available: false,
      category: 'orthopedics',
    },
    {
      id: 6,
      name: 'Dr. Lisa Martinez',
      specialization: 'Neurologist',
      experience: 14,
      rating: 4.9,
      reviews: 289,
      image: 'https://images.unsplash.com/photo-1632054224477-c9cb3aae1b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwMDUyODMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      category: 'neurology',
    },
  ];

  const specializations = [
    { id: 'cardiology', label: 'Cardiology' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'general', label: 'General Medicine' },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'orthopedics', label: 'Orthopedics' },
    { id: 'neurology', label: 'Neurology' },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecializations.length === 0 || 
                                  selectedSpecializations.includes(doctor.category);
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Find a Doctor</h1>
          <p className="text-muted-foreground">
            Book appointments with our experienced healthcare professionals
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specialization Filter */}
                <div>
                  <h4 className="mb-3">Specialization</h4>
                  <div className="space-y-2">
                    {specializations.map((spec) => (
                      <div key={spec.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec.id}
                          checked={selectedSpecializations.includes(spec.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSpecializations([...selectedSpecializations, spec.id]);
                            } else {
                              setSelectedSpecializations(selectedSpecializations.filter(s => s !== spec.id));
                            }
                          }}
                        />
                        <Label htmlFor={spec.id} className="text-sm cursor-pointer">
                          {spec.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h4 className="mb-3">Availability</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="available-today" />
                      <Label htmlFor="available-today" className="text-sm cursor-pointer">
                        Available Today
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="available-week" />
                      <Label htmlFor="available-week" className="text-sm cursor-pointer">
                        This Week
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Experience Filter */}
                <div>
                  <h4 className="mb-3">Experience</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="exp-5" />
                      <Label htmlFor="exp-5" className="text-sm cursor-pointer">5+ years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="exp-10" />
                      <Label htmlFor="exp-10" className="text-sm cursor-pointer">10+ years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="exp-15" />
                      <Label htmlFor="exp-15" className="text-sm cursor-pointer">15+ years</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctors Grid */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Results */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            </p>

            {/* Doctors Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  {...doctor}
                  onBookAppointment={() => onBookAppointment?.(doctor)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
