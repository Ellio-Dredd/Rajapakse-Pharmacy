import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, XCircle, Clock, FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { prescriptionsAPI } from '../utils/api';

export function AdminPrescriptionManagement() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionsAPI.getAll();
      console.log('Fetched prescriptions:', response);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await prescriptionsAPI.updateStatus(id, status);
      toast.success(`Prescription status updated to ${status}`);
      fetchPrescriptions();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error updating prescription status:', error);
      toast.error('Failed to update prescription status');
    }
  };

  const handleViewDetails = (prescription: any) => {
    console.log('Selected prescription:', prescription);
    console.log('Prescription files:', prescription.files);
    setSelectedPrescription(prescription);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescription_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Prescription Management</h2>
          <p className="text-muted-foreground">Review and manage prescription submissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, email, or prescription number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions ({filteredPrescriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Prescription #</th>
                  <th className="text-left p-4 font-medium">Patient</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Age</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Files</th>
                  <th className="text-left p-4 font-medium">Submitted</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      No prescriptions found
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <span className="font-mono text-sm">{prescription.prescription_number}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{prescription.patient_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {prescription.patient_phone && <div>{prescription.patient_phone}</div>}
                          {prescription.patient_email && (
                            <div className="text-muted-foreground">{prescription.patient_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{prescription.patient_age || '-'}</span>
                      </td>
                      <td className="p-4">{getStatusBadge(prescription.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{prescription.files?.length || 0} file(s)</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(prescription.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(prescription)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              Review prescription information and update status
            </DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Prescription Number</Label>
                  <p className="font-mono">{selectedPrescription.prescription_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPrescription.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Patient Name</Label>
                  <p>{selectedPrescription.patient_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                  <p>{selectedPrescription.patient_age || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p>{selectedPrescription.patient_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p>{selectedPrescription.patient_phone || '-'}</p>
                </div>
              </div>

              {selectedPrescription.address && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Delivery Address</Label>
                  <p className="text-sm">{selectedPrescription.address}</p>
                </div>
              )}

              {selectedPrescription.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                  <p className="text-sm">{selectedPrescription.notes}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Uploaded Files</Label>
                {!selectedPrescription.files || selectedPrescription.files.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">No files uploaded</p>
                ) : (
                  <div className="mt-2 space-y-3">
                    {selectedPrescription.files.map((file: any, index: number) => {
                      console.log(`File ${index}:`, { name: file.name, type: file.type, hasContent: !!file.content });
                      
                      return (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          {/* File Preview for Images */}
                          {file.content && file.type?.startsWith('image/') && (
                            <div className="bg-muted/30 p-4 flex justify-center">
                              <img 
                                src={file.content} 
                                alt={file.name}
                                className="max-h-48 rounded shadow-sm"
                                onError={(e) => {
                                  console.error('Image failed to load:', file.name);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* File Info and Actions */}
                          <div className="flex items-center gap-2 p-3 bg-muted/50">
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{file.name || 'Unknown file'}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'} • {file.type || 'Unknown type'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {file.content ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      try {
                                        // Open file in new tab for viewing
                                        const newWindow = window.open();
                                        if (newWindow) {
                                          if (file.type?.startsWith('image/')) {
                                            newWindow.document.write(`
                                              <html>
                                                <head>
                                                  <title>${file.name}</title>
                                                  <style>
                                                    body { margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000; }
                                                    img { max-width:100%; max-height:100vh; }
                                                  </style>
                                                </head>
                                                <body>
                                                  <img src="${file.content}" alt="${file.name}" />
                                                </body>
                                              </html>
                                            `);
                                          } else if (file.type === 'application/pdf') {
                                            newWindow.document.write(`
                                              <html>
                                                <head>
                                                  <title>${file.name}</title>
                                                  <style>body { margin:0; }</style>
                                                </head>
                                                <body>
                                                  <embed src="${file.content}" type="application/pdf" width="100%" height="100%" />
                                                </body>
                                              </html>
                                            `);
                                          }
                                        }
                                        toast.success('Opening file...');
                                      } catch (error) {
                                        console.error('Error viewing file:', error);
                                        toast.error('Failed to open file');
                                      }
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      try {
                                        // Download file
                                        const link = document.createElement('a');
                                        link.href = file.content;
                                        link.download = file.name || 'prescription-file';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        toast.success('File downloaded successfully');
                                      } catch (error) {
                                        console.error('Error downloading file:', error);
                                        toast.error('Failed to download file');
                                      }
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-red-500">File content not available</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Submitted</Label>
                <p className="text-sm">{new Date(selectedPrescription.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedPrescription?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedPrescription.id, 'rejected')}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedPrescription.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedPrescription?.status !== 'pending' && (
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus(selectedPrescription.id, 'pending')}
              >
                Reset to Pending
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Label component for dialog
function Label({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-sm font-medium ${className}`} {...props} />;
}