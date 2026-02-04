import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, UserCheck, UserX, Shield, ShieldOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usersAPI } from '../utils/api';
import { toast } from 'sonner';

export function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      // Fallback to demo data
      setUsers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'customer',
          status: 'Active',
          created_at: 'Jan 15, 2026',
          orders: 12,
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'customer',
          status: 'Active',
          created_at: 'Jan 20, 2026',
          orders: 8,
        },
      ]);
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
                <p className="text-2xl font-semibold">8,456</p>
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
                <p className="text-2xl font-semibold">7,892</p>
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
                <p className="text-2xl font-semibold">564</p>
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
                          user.status === 'Active'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{user.orders}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.joined}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
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
    </div>
  );
}