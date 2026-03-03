import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import { User } from './types';
import { I18nProvider } from './i18n';

type View = 'landing' | 'auth' | 'info';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [infoType, setInfoType] = useState<'privacy' | 'terms' | 'contact'>('privacy');

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

  const navigateToInfo = (type: 'privacy' | 'terms' | 'contact') => {
    setInfoType(type);
    setView('info');
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gunmetal">
        <div className="w-8 h-8 border-4 border-chartreuse border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return (
      <I18nProvider>
        <Dashboard user={user} onLogout={() => setUser(null)} />
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      {view === 'auth' ? (
        <Auth onLogin={(u) => setUser(u)} onBack={() => setView('landing')} />
      ) : view === 'info' ? (
        <InfoPage type={infoType} onBack={() => setView('landing')} />
      ) : (
        <LandingPage
          onGetStarted={() => setView('auth')}
          onNavigate={(type) => navigateToInfo(type)}
        />
      )}
    </I18nProvider>
  );
}
