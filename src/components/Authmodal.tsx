import { useState } from 'react';
import { X, Eye, EyeOff, LogIn, UserPlus, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

const AuthModal = ({ onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode]         = useState<'login' | 'signup' | 'forgot'>(defaultMode);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const { signIn, signUp } = useAuth();

  const reset = () => { setError(''); setSuccess(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://osirids-8b592.web.app',
      });
      if (error) setError(error.message);
      else setSuccess('Reset link sent! Check your email inbox.');
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else onClose();
    } else {
      if (!fullName.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setTimeout(() => { setMode('login'); reset(); }, 3500);
      }
    }
    setLoading(false);
  };

  const inp = 'w-full bg-[#0D0D0D] border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors text-white text-sm placeholder:text-white/20';

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md p-10 relative animate-scale-in space-y-8">

        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/o.png" alt="Osirids" className="w-14 h-14 mx-auto object-contain" />
          <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-widest">
            {mode === 'login'  ? 'Welcome Back'   :
             mode === 'signup' ? 'Join Osirids'   :
                                 'Reset Password' }
          </h2>
          <p className="text-white/30 text-xs tracking-widest uppercase">
            {mode === 'login'  ? 'Sign in to your account'   :
             mode === 'signup' ? 'Create your free account'  :
                                 'Enter your email below'    }
          </p>
        </div>

        {/* Tab switcher — only for login/signup */}
        {mode !== 'forgot' && (
          <div className="flex border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('login'); reset(); }}
              className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all ${mode === 'login' ? 'bg-pharoic-gold text-pharoic-black' : 'text-white/40 hover:text-white'}`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); reset(); }}
              className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all ${mode === 'signup' ? 'bg-pharoic-gold text-pharoic-black' : 'text-white/40 hover:text-white'}`}
            >
              SIGN UP
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className={inp}
              placeholder="Full Name"
              required
            />
          )}

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inp}
            placeholder="Email Address"
            required
          />

          {mode !== 'forgot' && (
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${inp} pr-12`}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {/* Forgot password link */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setMode('forgot'); reset(); }}
                className="text-xs text-white/30 hover:text-pharoic-gold transition-colors tracking-widest uppercase"
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center border border-red-400/20 bg-red-400/5 py-3 px-4">
              {error}
            </p>
          )}
          {success && (
            <p className="text-pharoic-gold text-xs text-center border border-pharoic-gold/20 bg-pharoic-gold/5 py-3 px-4">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 font-bold tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {loading ? (
              <><Loader size={16} className="animate-spin" /> PLEASE WAIT...</>
            ) : mode === 'login' ? (
              <><LogIn size={16} /> SIGN IN</>
            ) : mode === 'signup' ? (
              <><UserPlus size={16} /> CREATE ACCOUNT</>
            ) : (
              <>SEND RESET LINK</>
            )}
          </button>

          {/* Back to login from forgot */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('login'); reset(); }}
              className="w-full flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase"
            >
              <ArrowLeft size={13} /> Back to sign in
            </button>
          )}
        </form>

        <p className="text-center text-white/20 text-xs">
          By continuing you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;