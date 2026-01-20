import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Bell, 
  Users, 
  Database,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NavLink } from 'react-router-dom';
import { cn } from '@/app/components/ui/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['PPC', 'ASSISTANT_MANAGER'],
  },
  {
    label: 'Plans',
    icon: FileText,
    path: '/plans',
    roles: ['PPC', 'NPD_ENGINEER', 'TOOL_CRIB', 'QA_ENGINEER', 'STORE_EXECUTIVE', 'PRODUCTION_SUPERVISOR', 'ASSISTANT_MANAGER'],
  },
  {
    label: 'My Readiness',
    icon: CheckSquare,
    path: '/my-readiness',
    roles: ['NPD_ENGINEER', 'TOOL_CRIB', 'QA_ENGINEER', 'STORE_EXECUTIVE', 'PRODUCTION_SUPERVISOR'],
  },
  {
    label: 'Stream Status',
    icon: Activity,
    path: '/stream-status',
    roles: ['PPC', 'ASSISTANT_MANAGER'],
  },
  {
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
    roles: ['PPC', 'NPD_ENGINEER', 'TOOL_CRIB', 'QA_ENGINEER', 'STORE_EXECUTIVE', 'PRODUCTION_SUPERVISOR', 'ASSISTANT_MANAGER', 'ADMIN'],
  },
  {
    label: 'Admin',
    icon: Users,
    path: '/admin/users',
    roles: ['ADMIN'],
  },
  {
    label: 'Backups',
    icon: Database,
    path: '/admin/backups',
    roles: ['ADMIN'],
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 border-r bg-white h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
