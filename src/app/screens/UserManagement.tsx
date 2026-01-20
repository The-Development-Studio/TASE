import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { UserPlus, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';

const mockUsers: User[] = [
  { id: '1', username: 'ppc', name: 'PPC User', role: 'PPC', email: 'ppc@company.com', active: true },
  { id: '2', username: 'admin', name: 'Admin User', role: 'ADMIN', email: 'admin@company.com', active: true },
  { id: '3', username: 'npd', name: 'NPD Engineer', role: 'NPD_ENGINEER', email: 'npd@company.com', active: true },
  { id: '4', username: 'toolcrib', name: 'Tool Crib Person', role: 'TOOL_CRIB', email: 'toolcrib@company.com', active: true },
  { id: '5', username: 'qa', name: 'QA Engineer', role: 'QA_ENGINEER', email: 'qa@company.com', active: true },
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    role: 'NPD_ENGINEER' as UserRole,
  });

  const handleCreateUser = () => {
    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser,
      active: true,
    };
    setUsers([...users, user]);
    setIsDialogOpen(false);
    setNewUser({ username: '', name: '', email: '', role: 'NPD_ENGINEER' });
    toast.success('User created successfully');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
    toast.success('User status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="PPC">PPC</SelectItem>
                    <SelectItem value="NPD_ENGINEER">NPD Engineer</SelectItem>
                    <SelectItem value="TOOL_CRIB">Tool Crib</SelectItem>
                    <SelectItem value="QA_ENGINEER">QA Engineer</SelectItem>
                    <SelectItem value="STORE_EXECUTIVE">Store Executive</SelectItem>
                    <SelectItem value="PRODUCTION_SUPERVISOR">Production Supervisor</SelectItem>
                    <SelectItem value="ASSISTANT_MANAGER">Assistant Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role.replace(/_/g, ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? 'default' : 'secondary'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
