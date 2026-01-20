import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
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
import { Badge } from '@/app/components/ui/badge';
import { mockPlans } from '@/data/mockData';
import { CheckCircle, XCircle, Clock, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const StreamStatus = () => {
  const [filterMachine, setFilterMachine] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredPlans = mockPlans.filter(plan => {
    const matchesMachine = filterMachine === 'All' || plan.machineName === filterMachine;
    const matchesPriority = filterPriority === 'All' || plan.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || plan.status === filterStatus;
    return matchesMachine && matchesPriority && matchesStatus;
  });

  const totalPlans = mockPlans.length;
  const pendingReadiness = mockPlans.filter(p => p.status === 'Created').length;
  const productionReady = mockPlans.filter(p => p.status === 'Production Ready').length;
  const productionStarted = mockPlans.filter(p => p.status === 'Production Started').length;

  const machines = Array.from(new Set(mockPlans.map(p => p.machineName)));

  // Chart Colors - Power BI style
  const COLORS = {
    primary: '#00B0F0',
    success: '#70AD47',
    warning: '#FFC000',
    danger: '#FF5050',
    purple: '#7030A0',
    teal: '#00B7C3',
    orange: '#F4B183',
  };

  // Data for Status Distribution
  const statusData = [
    { name: 'Created', value: pendingReadiness, color: COLORS.warning },
    { name: 'Production Ready', value: productionReady, color: COLORS.success },
    { name: 'Production Started', value: productionStarted, color: COLORS.primary },
  ];

  // Data for Priority Distribution
  const priorityData = [
    { name: 'High', value: mockPlans.filter(p => p.priority === 'High').length, color: COLORS.danger },
    { name: 'Medium', value: mockPlans.filter(p => p.priority === 'Medium').length, color: COLORS.warning },
    { name: 'Low', value: mockPlans.filter(p => p.priority === 'Low').length, color: COLORS.teal },
  ];

  // Readiness by Role
  const readinessData = mockPlans[0]?.readiness.map(r => {
    const ready = mockPlans.filter(p => 
      p.readiness.find(item => item.role === r.role && item.status === 'Ready')
    ).length;
    const pending = mockPlans.filter(p => 
      p.readiness.find(item => item.role === r.role && item.status === 'Pending')
    ).length;
    const notReady = mockPlans.filter(p => 
      p.readiness.find(item => item.role === r.role && item.status === 'Not Ready')
    ).length;

    return {
      role: r.label.replace(' Status', ''),
      Ready: ready,
      Pending: pending,
      NotReady: notReady,
      total: ready + pending + notReady,
    };
  }) || [];

  // Readiness Completion Rate
  const completionRateData = mockPlans[0]?.readiness.map(r => {
    const ready = mockPlans.filter(p => 
      p.readiness.find(item => item.role === r.role && item.status === 'Ready')
    ).length;
    const total = mockPlans.length;
    
    return {
      role: r.label.replace(' Status', ''),
      rate: Math.round((ready / total) * 100),
    };
  }) || [];

  // Machine Utilization
  const machineData = machines.map(machine => {
    const plans = mockPlans.filter(p => p.machineName === machine);
    return {
      machine: machine.replace('Machine ', 'M'),
      plans: plans.length,
      ready: plans.filter(p => p.status === 'Production Ready').length,
      started: plans.filter(p => p.status === 'Production Started').length,
    };
  });

  // Radar Chart Data for Overall Health
  const radarData = mockPlans[0]?.readiness.map(r => {
    const ready = mockPlans.filter(p => 
      p.readiness.find(item => item.role === r.role && item.status === 'Ready')
    ).length;
    const total = mockPlans.length;
    
    return {
      subject: r.label.replace(' Status', ''),
      A: Math.round((ready / total) * 100),
      fullMark: 100,
    };
  }) || [];

  const getReadinessIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Not Ready':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  const completionRate = Math.round((productionReady + productionStarted) / totalPlans * 100);

  return (
    <div className="space-y-4 bg-gray-100 -m-8 p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stream Status Dashboard</h1>
          <p className="text-sm text-gray-600">Production Planning Intelligence & Analytics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Last Updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-2 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <Select value={filterMachine} onValueChange={setFilterMachine}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Machine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Machines</SelectItem>
                {machines.map(machine => (
                  <SelectItem key={machine} value={machine}>{machine}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Production Ready">Production Ready</SelectItem>
                <SelectItem value="Production Started">Production Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Plans</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalPlans}</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Active</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">{totalPlans}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{pendingReadiness}</p>
                <div className="flex items-center mt-2 text-xs text-orange-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{Math.round((pendingReadiness/totalPlans)*100)}%</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-orange-600">{pendingReadiness}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Ready</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{productionReady}</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{Math.round((productionReady/totalPlans)*100)}%</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-green-600">{productionReady}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Started</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{productionStarted}</p>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{Math.round((productionStarted/totalPlans)*100)}%</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">{productionStarted}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Plan Readiness Matrix - TOP POSITION */}
      <Card className="shadow-lg border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-b-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white">Plan Readiness Matrix</CardTitle>
              <p className="text-sm text-blue-100 mt-1">Real-time status tracking across all roles and plans</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <span className="text-sm font-medium">Ready</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-lg">
                <XCircle className="h-4 w-4 text-red-300" />
                <span className="text-sm font-medium">Not Ready</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-900 bg-gray-100 sticky left-0 z-20">Plan ID</TableHead>
                  <TableHead className="font-bold text-gray-900">Part Name</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Machine</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Priority</TableHead>
                  <TableHead className="text-center bg-green-50 font-bold text-gray-900 border-x">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Program</span>
                      <span className="text-[10px] text-gray-500 font-normal">NPD</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center bg-blue-50 font-bold text-gray-900 border-x">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Tooling</span>
                      <span className="text-[10px] text-gray-500 font-normal">Tool Crib</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center bg-purple-50 font-bold text-gray-900 border-x">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Gauge</span>
                      <span className="text-[10px] text-gray-500 font-normal">QA</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center bg-orange-50 font-bold text-gray-900 border-x">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Material</span>
                      <span className="text-[10px] text-gray-500 font-normal">Store</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center bg-teal-50 font-bold text-gray-900 border-x">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Fixture</span>
                      <span className="text-[10px] text-gray-500 font-normal">Production</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Overall</span>
                      <span className="text-[10px] text-gray-500 font-normal">Status</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-semibold">Completion</span>
                      <span className="text-[10px] text-gray-500 font-normal">Rate</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => {
                  const readyCount = plan.readiness.filter(r => r.status === 'Ready').length;
                  const totalReadiness = plan.readiness.length;
                  const completionPercentage = Math.round((readyCount / totalReadiness) * 100);
                  
                  return (
                    <TableRow 
                      key={plan.id} 
                      className={`hover:bg-blue-50 transition-colors border-b ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <TableCell className="font-bold text-blue-700 bg-gray-50 sticky left-0 z-10">
                        {plan.id}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        <div className="max-w-[200px]">
                          <div className="font-semibold">{plan.partName}</div>
                          <div className="text-xs text-gray-500">{plan.partNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs font-medium text-gray-700">
                          {plan.machineName.replace('Machine ', 'M')}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={plan.priority === 'High' ? 'destructive' : plan.priority === 'Medium' ? 'default' : 'secondary' as any}
                          className="font-semibold text-xs"
                        >
                          {plan.priority}
                        </Badge>
                      </TableCell>
                      {plan.readiness.map((r, idx) => {
                        const bgColors = [
                          'bg-green-50',
                          'bg-blue-50', 
                          'bg-purple-50',
                          'bg-orange-50',
                          'bg-teal-50'
                        ];
                        
                        return (
                          <TableCell 
                            key={r.role} 
                            className={`text-center border-x ${bgColors[idx]}`}
                          >
                            <div className="flex flex-col items-center space-y-1 py-2">
                              <div className={`p-2 rounded-full ${
                                r.status === 'Ready' 
                                  ? 'bg-green-200' 
                                  : r.status === 'Not Ready' 
                                  ? 'bg-red-200' 
                                  : 'bg-yellow-200'
                              }`}>
                                {getReadinessIcon(r.status)}
                              </div>
                              <span className={`text-[10px] font-semibold ${
                                r.status === 'Ready' 
                                  ? 'text-green-700' 
                                  : r.status === 'Not Ready' 
                                  ? 'text-red-700' 
                                  : 'text-yellow-700'
                              }`}>
                                {r.status}
                              </span>
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            plan.status === 'Production Started'
                              ? 'default'
                              : plan.status === 'Production Ready'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="font-semibold text-xs whitespace-nowrap"
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="text-lg font-bold" style={{ 
                            color: completionPercentage === 100 
                              ? COLORS.success 
                              : completionPercentage >= 60 
                              ? COLORS.warning 
                              : COLORS.danger 
                          }}>
                            {completionPercentage}%
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all" 
                              style={{ 
                                width: `${completionPercentage}%`,
                                backgroundColor: completionPercentage === 100 
                                  ? COLORS.success 
                                  : completionPercentage >= 60 
                                  ? COLORS.warning 
                                  : COLORS.danger
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-500">{readyCount}/{totalReadiness}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Main Charts Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution Donut */}
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-base font-semibold">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t pt-4">
              {statusData.map(item => (
                <div key={item.name}>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-white">
            <CardTitle className="text-base font-semibold">Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t pt-4">
              {priorityData.map(item => (
                <div key={item.name}>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Readiness Completion Rate */}
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-base font-semibold">Completion Rate by Role</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {completionRateData.map(item => (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.role}</span>
                    <span className="text-sm font-bold text-gray-900">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all" 
                      style={{ 
                        width: `${item.rate}%`,
                        backgroundColor: item.rate >= 75 ? COLORS.success : item.rate >= 50 ? COLORS.warning : COLORS.danger
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Machine Utilization */}
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-white">
            <CardTitle className="text-base font-semibold">Machine Utilization</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={machineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="machine" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="plans" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                <Area type="monotone" dataKey="ready" stackId="1" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.6} />
                <Area type="monotone" dataKey="started" stackId="1" stroke={COLORS.purple} fill={COLORS.purple} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Health Radar */}
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-base font-semibold">Readiness Health Score</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Readiness" dataKey="A" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-xs text-gray-600">Overall Completion</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width - Readiness by Role Stacked Bar */}
      <Card className="shadow-md">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-base font-semibold">Readiness Status by Role - Detailed View</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={readinessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Ready" stackId="a" fill={COLORS.success} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Pending" stackId="a" fill={COLORS.warning} radius={[0, 0, 0, 0]} />
              <Bar dataKey="NotReady" stackId="a" fill={COLORS.danger} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};