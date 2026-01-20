import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { mockPlans } from '@/data/mockData';
import { FileText, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  
  const totalPlans = mockPlans.length;
  const pendingReadiness = mockPlans.filter(p => p.status === 'Created').length;
  const productionReady = mockPlans.filter(p => p.status === 'Production Ready').length;
  const productionStarted = mockPlans.filter(p => p.status === 'Production Started').length;

  const recentPlans = mockPlans.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of production planning and readiness status</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Plans</CardTitle>
            <FileText className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalPlans}</div>
            <p className="text-xs text-gray-500 mt-1">Active production plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Readiness</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-600">{pendingReadiness}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting readiness</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Production Ready</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{productionReady}</div>
            <p className="text-xs text-gray-500 mt-1">Ready to start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Production Started</CardTitle>
            <Play className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">{productionStarted}</div>
            <p className="text-xs text-gray-500 mt-1">In production</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate(`/plans/${plan.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{plan.id}</span>
                    <Badge
                      variant={
                        plan.priority === 'High'
                          ? 'destructive'
                          : plan.priority === 'Medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {plan.priority}
                    </Badge>
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
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{plan.partName} - {plan.machineName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Qty: {plan.planQuantity}</p>
                  <p className="text-xs text-gray-400">Start: {plan.startDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
