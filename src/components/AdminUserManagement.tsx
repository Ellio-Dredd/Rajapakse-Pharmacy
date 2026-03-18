import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, UserCheck, UserX, Shield, ShieldOff, Trash2, RefreshCw, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usersAPI } from '../utils/api';
import { toast } from 'sonner';

export function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [actionType, setActionType] = useState<'deactivate' | 'activate' | 'delete'>('deactivate');
  
  // Calculate stats from users data
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      console.log('Fetched users from database:', response.data);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await usersAPI.updateRole(selectedUser.id, newRole);
      toast.success('User role updated successfully');
      setIsRoleDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const openRoleDialog = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role || 'customer');
    setIsRoleDialogOpen(true);
  };

  const openDeleteDialog = (user: any, type: 'deactivate' | 'activate' | 'delete') => {
    setSelectedUser(user);
    setActionType(type);
    setIsDeleteDialogOpen(true);
  };

  const openProfileDialog = (user: any) => {
    setSelectedUser(user);
    setIsProfileDialogOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage platform users and their accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-2xl font-semibold">{stats.active}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inactive Users</p>
                <p className="text-2xl font-semibold">{stats.inactive}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <UserX className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Search users..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          user.status === 'active'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{user.orders || 0}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : user.joined || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfileDialog(user)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              openDeleteDialog(user, user.status === 'active' ? 'deactivate' : 'activate')
                            }
                          >
                            {user.status === 'active' ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(user, 'delete')}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
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

      {/* Role Update Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete/Deactivate/Activate Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'delete'
                ? 'Are you sure you want to delete this user?'
                : actionType === 'deactivate'
                ? 'Deactivate User Account'
                : 'Activate User Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'delete' ? (
                <>
                  This action cannot be undone. This will permanently delete{' '}
                  <strong>{selectedUser?.name}'s</strong> account and remove all their data from the system.
                </>
              ) : actionType === 'deactivate' ? (
                <>
                  This will mark <strong>{selectedUser?.name}</strong> as inactive. They won't be able to access their account until reactivated.
                </>
              ) : (
                <>
                  This will reactivate <strong>{selectedUser?.name}'s</strong> account and restore their access to the platform.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={actionType === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
              onClick={async () => {
                if (!selectedUser) return;

                try {
                  if (actionType === 'delete') {
                    await usersAPI.delete(selectedUser.id);
                    toast.success('User deleted successfully');
                  } else if (actionType === 'deactivate') {
                    await usersAPI.deactivate(selectedUser.id);
                    toast.success('User deactivated successfully');
                  } else {
                    await usersAPI.activate(selectedUser.id);
                    toast.success('User activated successfully');
                  }
                  setIsDeleteDialogOpen(false);
                  fetchUsers();
                } catch (error) {
                  console.error(`Error ${actionType}ing user:`, error);
                  toast.error(`Failed to ${actionType} user`);
                }
              }}
            >
              {actionType === 'delete' ? 'Delete' : actionType === 'deactivate' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View details of {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                <AvatarFallback>{selectedUser?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">Role: {selectedUser?.role}</div>
            </div>
            <div className="flex items-center gap-3">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">Status: {selectedUser?.status}</div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldOff className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">Orders: {selectedUser?.orders || 0}</div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">Joined: {selectedUser?.created_at ? new Date(selectedUser?.created_at).toLocaleDateString() : selectedUser?.joined || '-'}</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}