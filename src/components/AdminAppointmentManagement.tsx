import { useState, useEffect } from 'react';
import { Search, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { appointmentsAPI } from '../utils/api';
import { toast } from 'sonner';

export function AdminAppointmentManagement() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      // Fallback to demo data
      setAppointments([
        {
          id: 1,
          patient: 'John Doe',
          patientEmail: 'john.doe@example.com',
          doctor: 'Dr. Michael Chen',
          doctorSpecialty: 'Cardiologist',
          appointment_date: 'Feb 3, 2026',
          appointment_time: '09:00 AM',
          status: 'Confirmed',
          type: 'In-person',
        },
        {
          id: 2,
          patient: 'Jane Smith',
          patientEmail: 'jane.smith@example.com',
          doctor: 'Dr. Sarah Williams',
          doctorSpecialty: 'Pediatrician',
          appointment_date: 'Feb 3, 2026',
          appointment_time: '10:30 AM',
          status: 'Pending',
          type: 'Video Call',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, newStatus);
      toast.success('Appointment status updated successfully');
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentsAPI.cancel(appointmentId);
      toast.success('Appointment cancelled successfully');
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to permanently delete this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      await appointmentsAPI.delete(appointmentId);
      toast.success('Appointment deleted successfully');
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-success/10 text-success';
      case 'Pending':
        return 'bg-warning/10 text-warning';
      case 'Completed':
        return 'bg-primary/10 text-primary';
      case 'Cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Appointment Management</h1>
        <p className="text-muted-foreground">Manage doctor appointments and schedules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Today</p>
                <p className="text-2xl font-semibold">24</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
                <p className="text-2xl font-semibold">18</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-semibold">4</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-semibold">156</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Appointments</CardTitle>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Search appointments..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Doctor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {appointment.patient ? appointment.patient.split(' ').map((n: string) => n[0]).join('') : 'NA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{appointment.patient || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{appointment.patientEmail || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{appointment.doctor}</div>
                        <div className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{appointment.appointment_date}</div>
                        <div className="text-sm text-muted-foreground">{appointment.appointment_time}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{appointment.type}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleCancelAppointment(appointment.id)}>Cancel</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAppointment(appointment.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}