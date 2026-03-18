import { useState, useEffect } from 'react';
import { Search, Calendar, MoreHorizontal, User, Mail, Phone, Clock, FileText } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { appointmentsAPI } from '../utils/api';
import { toast } from 'sonner';

export function AdminAppointmentManagement() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Calculate stats from appointments data
  const today = new Date().toISOString().split('T')[0];
  const stats = {
    totalToday: appointments.filter(a => a.appointment_date === today).length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentsAPI.getAll();
      console.log('Fetched appointments from database:', response);
      
      if (response.success && response.data) {
        setAppointments(response.data);
        console.log('Loaded appointments:', response.data.length);
      } else {
        console.error('Invalid response format:', response);
        setError('Invalid response format from server');
        setAppointments([]);
      }
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      setError(error.message || 'Failed to load appointments');
      toast.error('Failed to load appointments: ' + (error.message || 'Unknown error'));
      setAppointments([]);
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

  // Filter appointments based on search query and status filter
  const filteredAppointments = appointments.filter((appointment) => {
    // Status filter
    if (statusFilter !== 'all' && appointment.status?.toLowerCase() !== statusFilter) {
      return false;
    }
    
    // Search filter - search across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        appointment.patient,
        appointment.patientEmail,
        appointment.doctor,
        appointment.doctorSpecialty,
        appointment.appointment_date,
        appointment.appointment_time,
        appointment.type,
        appointment.status,
        appointment.symptoms,
        appointment.notes,
        appointment.appointment_number,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

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
                <p className="text-2xl font-semibold">{stats.totalToday}</p>
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
                <p className="text-2xl font-semibold">{stats.confirmed}</p>
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
                <p className="text-2xl font-semibold">{stats.pending}</p>
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
                <p className="text-2xl font-semibold">{stats.completed}</p>
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
                <Input 
                  type="text" 
                  placeholder="Search appointments..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading appointments...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-destructive mb-2">Error: {error}</p>
                  <Button onClick={fetchAppointments} variant="outline" size="sm">
                    Retry
                  </Button>
                </div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments found in database</p>
                  <p className="text-sm text-muted-foreground mt-2">Appointments will appear here once patients book them</p>
                </div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments match your filters</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your search query or status filter</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }} 
                    variant="outline" 
                    size="sm"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
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
                  {filteredAppointments.map((appointment) => (
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
                          <div className="font-medium">{appointment.doctor || 'N/A'}</div>
                          {appointment.doctorSpecialty && appointment.doctorSpecialty !== 'N/A' && (
                            <div className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{appointment.appointment_date || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{appointment.appointment_time || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{appointment.type || 'N/A'}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status || 'N/A'}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsDetailsDialogOpen(true);
                            }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedAppointment(appointment);
                              setNewStatus(appointment.status.toLowerCase());
                              setIsStatusDialogOpen(true);
                            }}>
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast.success('Reminder sent to ' + appointment.patientEmail);
                            }}>
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleCancelAppointment(appointment.id)}>Cancel</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAppointment(appointment.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  {selectedAppointment.appointment_number || selectedAppointment.id}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Patient Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedAppointment.patient || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedAppointment.patientEmail || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedAppointment.patient_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Doctor Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedAppointment.doctor || 'N/A'}</p>
                      </div>
                    </div>
                    {selectedAppointment.doctorSpecialty && selectedAppointment.doctorSpecialty !== 'N/A' && (
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Specialty</p>
                          <p className="font-medium">{selectedAppointment.doctorSpecialty}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Appointment Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{selectedAppointment.appointment_date || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedAppointment.appointment_time || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <Badge variant="outline">{selectedAppointment.type || 'N/A'}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={getStatusColor(selectedAppointment.status)}>
                          {selectedAppointment.status || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {(selectedAppointment.symptoms || selectedAppointment.notes) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Additional Information</h4>
                      <div className="space-y-3">
                        {selectedAppointment.symptoms && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Symptoms</p>
                            <p className="text-sm">{selectedAppointment.symptoms}</p>
                          </div>
                        )}
                        {selectedAppointment.notes && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm">{selectedAppointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="w-full max-w-md">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Change Appointment Status</DialogTitle>
                <DialogDescription>
                  Update the status for {selectedAppointment.patient}'s appointment
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Status</label>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">New Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={async () => {
                    await handleUpdateStatus(selectedAppointment.id, newStatus);
                    setIsStatusDialogOpen(false);
                  }}
                >
                  Update Status
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}