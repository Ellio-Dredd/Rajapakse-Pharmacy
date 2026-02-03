import { Star, Calendar, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface DoctorCardProps {
  image: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  available?: boolean;
  onBookAppointment?: () => void;
}

export function DoctorCard({
  image,
  name,
  specialization,
  experience,
  rating,
  reviews,
  available = true,
  onBookAppointment,
}: DoctorCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-muted/30">
          <img
            src={image}
            alt={name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {available && (
            <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
              Available
            </Badge>
          )}
        </div>
        <div className="p-5">
          <h3 className="mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{specialization}</p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{experience} yrs</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
          </div>
          
          <Button
            className="w-full gap-2"
            onClick={onBookAppointment}
            disabled={!available}
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
