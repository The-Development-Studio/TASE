import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { Label } from '@/app/components/ui/label';
import { mockPlans } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import { ReadinessStatus } from '@/types';

export const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const plan = mockPlans.find(p => p.id === id);
  const [readinessStates, setReadinessStates] = useState(
    plan?.readiness.reduce((acc, item) => ({
      ...acc,
      [item.role]: item.status,
    }), {}) || {}
  );

  if (!plan) {
    return <div>Plan not found</div>;
  }

  const isReadOnly = plan.status === 'Production Started';
  const canEditMyReadiness = plan.readiness.some(r => r.role === user?.role) && !isReadOnly;
  const myReadinessItem = plan.readiness.find(r => r.role === user?.role);
  
  const allReady = plan.readiness.every(r => readinessStates[r.role] === 'Ready');
  const canStartProduction = user?.role === 'PPC' && plan.status === 'Production Ready' && allReady;

  const handleReadinessChange = (role: string, status: ReadinessStatus) => {
    setReadinessStates(prev => ({ ...prev, [role]: status }));
    toast.success('Readiness status updated');
  };

  const handleStartProduction = () => {
    toast.success('Production started successfully!');
    navigate('/plans');
  };

  const getRoleLabel = (role: string) => {
    const item = plan.readiness.find(r => r.role === role);
    return item?.label || role.replace(/_/g, ' ');
  };

  const getStatusBadge = (status: ReadinessStatus) => {
    const variants = {
      Ready: 'default',
      Pending: 'outline',
      'Not Ready': 'destructive',
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/plans')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{plan.id} - {plan.partName}</h1>
            <p className="text-sm text-gray-500">Production Plan Details</p>
          </div>
        </div>
        <Badge
          variant={
            plan.status === 'Production Started'
              ? 'default'
              : plan.status === 'Production Ready'
              ? 'secondary'
              : 'outline'
          }
          className="text-base px-4 py-2"
        >
          {plan.status}
        </Badge>
      </div>

      {/* Production Ready Banner */}
      {allReady && plan.status !== 'Production Started' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Plan is Production Ready</h3>
                <p className="text-sm text-green-700">All readiness checks are complete</p>
              </div>
            </div>
            {canStartProduction && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Mark Production Started
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Production Start</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to mark this plan as Production Started? This action will lock the plan and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStartProduction}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
        </Card>
      )}

      {/* Locked Notice */}
      {isReadOnly && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900">
              <strong>Production Started:</strong> This plan is locked and cannot be modified. 
              Started on {plan.productionStartedAt} by {plan.productionStartedBy}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-500">Machine Name</Label>
              <p className="font-medium mt-1">{plan.machineName}</p>
            </div>
            <div>
              <Label className="text-gray-500">Order No</Label>
              <p className="font-medium mt-1">{plan.orderNo}</p>
            </div>
            <div>
              <Label className="text-gray-500">Part Number</Label>
              <p className="font-medium mt-1">{plan.partNumber}</p>
            </div>
            <div>
              <Label className="text-gray-500">Part Name</Label>
              <p className="font-medium mt-1">{plan.partName}</p>
            </div>
            <div>
              <Label className="text-gray-500">Plan Quantity</Label>
              <p className="font-medium mt-1">{plan.planQuantity}</p>
            </div>
            <div>
              <Label className="text-gray-500">Start Date</Label>
              <p className="font-medium mt-1">{plan.startDate}</p>
            </div>
            <div>
              <Label className="text-gray-500">Priority</Label>
              <div className="mt-1">
                <Badge variant={plan.priority === 'High' ? 'destructive' : plan.priority === 'Medium' ? 'default' : 'secondary' as any}>
                  {plan.priority}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Traveller No</Label>
              <p className="font-medium mt-1">{plan.travellerNo}</p>
            </div>
            <div>
              <Label className="text-gray-500">Fixture No</Label>
              <p className="font-medium mt-1">{plan.fixtureNo}</p>
            </div>
            <div>
              <Label className="text-gray-500">Program Name</Label>
              <p className="font-medium mt-1">{plan.programName}</p>
            </div>
            <div>
              <Label className="text-gray-500">Created By</Label>
              <p className="font-medium mt-1">{plan.createdBy}</p>
            </div>
            <div>
              <Label className="text-gray-500">Created At</Label>
              <p className="font-medium mt-1">{new Date(plan.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readiness Section */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.readiness.map((item) => {
              const isMySection = item.role === user?.role;
              const canEdit = isMySection && canEditMyReadiness;
              
              return (
                <div
                  key={item.role}
                  className={`p-4 rounded-lg border ${
                    isMySection ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{getRoleLabel(item.role)}</h3>
                      <p className="text-sm text-gray-500">{item.role.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {canEdit ? (
                        <Select
                          value={readinessStates[item.role]}
                          onValueChange={(value) => handleReadinessChange(item.role, value as ReadinessStatus)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Ready">Ready</SelectItem>
                            <SelectItem value="Not Ready">Not Ready</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(readinessStates[item.role] as ReadinessStatus)
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
