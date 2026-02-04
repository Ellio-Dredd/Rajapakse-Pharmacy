import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Stethoscope, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { doctorsAPI } from '../utils/api';
import { toast } from 'sonner';
import { formatCurrency } from '../utils/currency';

const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'ENT Specialist',
  'Neurologist',
  'Psychiatrist',
  'Ophthalmologist',
  'Dentist',
  'Physiotherapist',
];

// Define DoctorForm outside the main component to prevent re-creation on each render
function DoctorForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitLabel 
}: { 
  formData: any; 
  setFormData: (data: any) => void; 
  onSubmit: () => void; 
  submitLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Doctor Name *</Label>
          <Input
            id="name"
            placeholder="Dr. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization *</Label>
          <Select
            value={formData.specialization}
            onValueChange={(value) => setFormData({ ...formData, specialization: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="qualifications">Qualifications</Label>
          <Input
            id="qualifications"
            placeholder="MBBS, MD"
            value={formData.qualifications}
            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience_years">Experience (Years)</Label>
          <Input
            id="experience_years"
            type="number"
            placeholder="10"
            value={formData.experience_years}
            onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="consultation_fee">Consultation Fee (LKR) *</Label>
          <Input
            id="consultation_fee"
            type="number"
            placeholder="2500"
            value={formData.consultation_fee}
            onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="0771234567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="doctor@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          placeholder="https://example.com/doctor.jpg"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Doctor's biography and expertise..."
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="availability"
          checked={formData.availability}
          onCheckedChange={(checked) => setFormData({ ...formData, availability: checked as boolean })}
        />
        <Label htmlFor="availability" className="cursor-pointer">
          Available for appointments
        </Label>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </DialogFooter>
    </div>
  );
}

export function AdminDoctorManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualifications: '',
    experience_years: '',
    consultation_fee: '',
    email: '',
    phone: '',
    image_url: '',
    bio: '',
    availability: true,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      qualifications: '',
      experience_years: '',
      consultation_fee: '',
      email: '',
      phone: '',
      image_url: '',
      bio: '',
      availability: true,
    });
    setEditingDoctor(null);
  };

  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (open) {
      resetForm();
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleAddDoctor = async () => {
    try {
      if (!formData.name || !formData.specialization || !formData.consultation_fee) {
        toast.error('Please fill in all required fields');
        return;
      }

      const doctorData = {
        name: formData.name,
        specialization: formData.specialization,
        qualifications: formData.qualifications || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        consultation_fee: parseFloat(formData.consultation_fee),
        email: formData.email || null,
        phone: formData.phone || null,
        image_url: formData.image_url || null,
        bio: formData.bio || null,
        availability: formData.availability,
      };

      await doctorsAPI.create(doctorData);
      toast.success('Doctor added successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to add doctor');
    }
  };

  const handleEditDoctor = async () => {
    try {
      if (!formData.name || !formData.specialization || !formData.consultation_fee) {
        toast.error('Please fill in all required fields');
        return;
      }

      const doctorData = {
        name: formData.name,
        specialization: formData.specialization,
        qualifications: formData.qualifications || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        consultation_fee: parseFloat(formData.consultation_fee),
        email: formData.email || null,
        phone: formData.phone || null,
        image_url: formData.image_url || null,
        bio: formData.bio || null,
        availability: formData.availability,
      };

      await doctorsAPI.update(editingDoctor.id, doctorData);
      toast.success('Doctor updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await doctorsAPI.delete(id);
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor');
    }
  };

  const openEditDialog = (doctor: any) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      qualifications: doctor.qualifications || '',
      experience_years: doctor.experience_years?.toString() || '',
      consultation_fee: doctor.consultation_fee?.toString() || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      image_url: doctor.image_url || '',
      bio: doctor.bio || '',
      availability: doctor.availability ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Doctors Management</h1>
          <p className="text-muted-foreground">Manage doctors and their information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>Add a new doctor to your healthcare platform</DialogDescription>
            </DialogHeader>
            <DoctorForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleAddDoctor} 
              submitLabel="Add Doctor" 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or specialization..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
                <p className="text-2xl font-semibold">{doctors.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No doctors found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Doctor</th>
                    <th className="text-left p-4 font-medium">Specialization</th>
                    <th className="text-left p-4 font-medium">Qualifications</th>
                    <th className="text-left p-4 font-medium">Experience</th>
                    <th className="text-left p-4 font-medium">Consultation Fee</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            {doctor.image_url ? (
                              <img
                                src={doctor.image_url}
                                alt={doctor.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                <Stethoscope className="h-5 w-5 text-primary" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{doctor.specialization}</td>
                      <td className="p-4">{doctor.qualifications || '-'}</td>
                      <td className="p-4">{doctor.experience_years ? `${doctor.experience_years} years` : '-'}</td>
                      <td className="p-4">{formatCurrency(doctor.consultation_fee)}</td>
                      <td className="p-4">
                        <Badge variant={doctor.availability ? 'default' : 'secondary'}>
                          {doctor.availability ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {doctor.phone && <div>{doctor.phone}</div>}
                          {doctor.email && <div className="text-muted-foreground">{doctor.email}</div>}
                          {!doctor.phone && !doctor.email && '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(doctor)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDoctor(doctor.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>Update doctor information</DialogDescription>
          </DialogHeader>
          <DoctorForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleEditDoctor} 
            submitLabel="Update Doctor" 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}