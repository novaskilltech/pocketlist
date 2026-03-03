import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to request OTP');
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gunmetal p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-chartreuse">PocketList</h1>
          <p className="text-white/60 mt-2">Vos courses, simplifiées.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestOtp}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-chartreuse focus:border-transparent outline-none transition-all text-base"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                disabled={loading}
                className="w-full bg-chartreuse text-gunmetal py-3 rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-chartreuse/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continuer <ArrowRight className="w-5 h-5" /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Code reçu par email</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl tracking-widest text-white placeholder:text-white/20 focus:ring-2 focus:ring-chartreuse focus:border-transparent outline-none transition-all text-base"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                disabled={loading}
                className="w-full bg-chartreuse text-gunmetal py-3 rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-chartreuse/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier le code'}
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-white/40 text-sm hover:text-white transition-colors"
              >
                Changer d'email
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <button
          onClick={onBack}
          className="mt-8 w-full text-white/20 text-xs hover:text-white/40 transition-colors uppercase tracking-widest font-bold"
        >
          Retour à l'accueil
        </button>
      </motion.div>
    </div>
  );
}
