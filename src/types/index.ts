// User Roles
export type UserRole = 
  | 'ADMIN'
  | 'PPC'
  | 'NPD_ENGINEER'
  | 'TOOL_CRIB'
  | 'QA_ENGINEER'
  | 'STORE_EXECUTIVE'
  | 'PRODUCTION_SUPERVISOR'
  | 'ASSISTANT_MANAGER';

// Plan Priority
export type PlanPriority = 'High' | 'Medium' | 'Low';

// Plan Status
export type PlanStatus = 'Created' | 'Production Ready' | 'Production Started';

// Readiness Status
export type ReadinessStatus = 'Pending' | 'Ready' | 'Not Ready';

// User
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  active: boolean;
}

// Readiness Item
export interface ReadinessItem {
  role: UserRole;
  label: string;
  status: ReadinessStatus;
  updatedBy?: string;
  updatedAt?: string;
}

// Plan
export interface Plan {
  id: string;
  machineName: string;
  orderNo: string;
  partNumber: string;
  partName: string;
  planQuantity: number;
  startDate: string;
  priority: PlanPriority;
  travellerNo: string;
  fixtureNo: string;
  programName: string;
  status: PlanStatus;
  createdBy: string;
  createdAt: string;
  readiness: ReadinessItem[];
  productionStartedAt?: string;
  productionStartedBy?: string;
}

// Notification
export interface Notification {
  id: string;
  type: 'New Plan' | 'Readiness Pending' | 'Production Ready' | 'Production Started';
  message: string;
  planId: string;
  read: boolean;
  createdAt: string;
}

// Backup
export interface Backup {
  id: string;
  createdAt: string;
  size: string;
  status: 'Completed' | 'In Progress' | 'Failed';
}
