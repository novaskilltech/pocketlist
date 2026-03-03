import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Auth check failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gunmetal">
        <div className="w-8 h-8 border-4 border-chartreuse border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <>
      {showAuth ? (
        <Auth onLogin={(u) => setUser(u)} onBack={() => setShowAuth(false)} />
      ) : (
        <LandingPage onGetStarted={() => setShowAuth(true)} />
      )}
    </>
  );
}
