import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/app/components/ui/sonner';
import { Header } from '@/app/components/Header';
import { Sidebar } from '@/app/components/Sidebar';

// Screens
import { Login } from '@/app/screens/Login';
import { Dashboard } from '@/app/screens/Dashboard';
import { CreatePlan } from '@/app/screens/CreatePlan';
import { PlansList } from '@/app/screens/PlansList';
import { PlanDetail } from '@/app/screens/PlanDetail';
import { MyReadiness } from '@/app/screens/MyReadiness';
import { StreamStatus } from '@/app/screens/StreamStatus';
import { Notifications } from '@/app/screens/Notifications';
import { UserManagement } from '@/app/screens/UserManagement';
import { BackupManagement } from '@/app/screens/BackupManagement';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout Component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// App Router
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlansList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/plans/create"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreatePlan />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/plans/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlanDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/my-readiness"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyReadiness />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/stream-status"
        element={
          <ProtectedRoute>
            <AppLayout>
              <StreamStatus />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Notifications />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/backups"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BackupManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
