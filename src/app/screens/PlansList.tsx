import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { mockPlans } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search } from 'lucide-react';

export const PlansList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const filteredPlans = mockPlans.filter((plan) => {
    const matchesSearch =
      plan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.machineName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || plan.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || plan.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getMyReadinessStatus = (plan: typeof mockPlans[0]) => {
    const myReadiness = plan.readiness.find(r => r.role === user?.role);
    return myReadiness?.status || 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production Started':
        return 'bg-blue-100 text-blue-800';
      case 'Production Ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Production Plans</h1>
          <p className="text-sm text-gray-500">View and manage all production plans</p>
        </div>
        {user?.role === 'PPC' && (
          <Button onClick={() => navigate('/plans/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Created">Created</SelectItem>
              <SelectItem value="Production Ready">Production Ready</SelectItem>
              <SelectItem value="Production Started">Production Started</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan ID</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Overall Status</TableHead>
              <TableHead>My Readiness</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow
                key={plan.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/plans/${plan.id}`)}
              >
                <TableCell className="font-medium">{plan.id}</TableCell>
                <TableCell>{plan.machineName}</TableCell>
                <TableCell>{plan.partName}</TableCell>
                <TableCell>{plan.startDate}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(plan.priority) as any}>
                    {plan.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      getMyReadinessStatus(plan) === 'Ready'
                        ? 'default'
                        : getMyReadinessStatus(plan) === 'Not Ready'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {getMyReadinessStatus(plan)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
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
