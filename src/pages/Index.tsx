
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ServerLogs } from '@/components/ServerLogs';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to Quluub</h1>
          <p className="mb-8 text-lg">
            A Muslim matrimonial platform designed to help you find your perfect match.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!user && (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="default" size="lg">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Server Logs</h2>
            <ServerLogs />
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-muted">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Quluub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
