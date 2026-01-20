import { useNavigate } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { mockPlans } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const MyReadiness = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myPlans = mockPlans.filter(plan => 
    plan.readiness.some(r => r.role === user?.role)
  );

  const getMyReadinessStatus = (plan: typeof mockPlans[0]) => {
    const myReadiness = plan.readiness.find(r => r.role === user?.role);
    return myReadiness?.status || 'N/A';
  };

  const getMyReadinessLabel = (plan: typeof mockPlans[0]) => {
    const myReadiness = plan.readiness.find(r => r.role === user?.role);
    return myReadiness?.label || '';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Not Ready':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-orange-500" />;
    }
  };

  const pendingCount = myPlans.filter(p => getMyReadinessStatus(p) === 'Pending').length;
  const readyCount = myPlans.filter(p => getMyReadinessStatus(p) === 'Ready').length;
  const notReadyCount = myPlans.filter(p => getMyReadinessStatus(p) === 'Not Ready').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Readiness</h1>
        <p className="text-sm text-gray-500">Manage your readiness status for assigned plans</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Ready</p>
              <p className="text-2xl font-semibold">{readyCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Not Ready</p>
              <p className="text-2xl font-semibold">{notReadyCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plans Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan ID</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>My Responsibility</TableHead>
              <TableHead>My Status</TableHead>
              <TableHead>Overall Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myPlans.map((plan) => (
              <TableRow
                key={plan.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/plans/${plan.id}`)}
              >
                <TableCell className="font-medium">{plan.id}</TableCell>
                <TableCell>{plan.partName}</TableCell>
                <TableCell>{plan.machineName}</TableCell>
                <TableCell>{plan.startDate}</TableCell>
                <TableCell>{getMyReadinessLabel(plan)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(getMyReadinessStatus(plan))}
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
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      plan.status === 'Production Started'
                        ? 'default'
                        : plan.status === 'Production Ready'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Update
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
