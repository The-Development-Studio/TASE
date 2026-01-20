import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import Logo from '@/assets/logo.png';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <img
  src={Logo}
  alt="PPC Logo"
  className="h-16 w-auto mx-auto object-contain"
/>

          <CardTitle className="text-2xl">PPC Plan Streaming & Readiness Platform</CardTitle>
          <CardDescription>Sign in to access the manufacturing operations system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>PPC:</strong> ppc / password</p>
                <p><strong>Admin:</strong> admin / password</p>
                <p><strong>NPD:</strong> npd / password</p>
                <p><strong>Tool Crib:</strong> toolcrib / password</p>
                <p><strong>QA:</strong> qa / password</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
