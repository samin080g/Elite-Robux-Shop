import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface AuthProps {
  onAuth: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setEmail('');
    setLoginIdentifier('');
    setPassword('');
    setError('');
  }, [isLogin]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = storageService.getUsers();

    if (isLogin) {
      const user = users.find(u => 
        (u.email.toLowerCase() === loginIdentifier.toLowerCase() || u.username.toLowerCase() === loginIdentifier.toLowerCase()) && 
        u.passwordHash === password
      );
      
      if (user) {
        storageService.login(user);
        onAuth();
      } else {
        setError('Invalid credentials. Terminal access denied.');
      }
    } else {
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('Protocol Error: Identity already exists in database.');
        return;
      }
      
      const newUser: User = {
        id: `U-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        username,
        email,
        passwordHash: password,
        role: users.length === 0 ? 'main_admin' : 'user',
        createdAt: Date.now()
      };
      
      storageService.saveUser(newUser);
      storageService.login(newUser);
      onAuth();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass p-10 neon-border">
        <div className="flex justify-center mb-8 border-b border-white/10">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`px-8 py-3 font-orbitron font-black tracking-widest text-xs transition-all ${isLogin ? 'text-[#39ff14] border-b-2 border-[#39ff14]' : 'text-gray-500 hover:text-white'}`}
          >
            LOGIN
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 font-orbitron font-black tracking-widest text-xs transition-all ${!isLogin ? 'text-[#39ff14] border-b-2 border-[#39ff14]' : 'text-gray-500 hover:text-white'}`}
          >
            SIGN UP
          </button>
        </div>

        <h1 className="text-3xl font-orbitron font-black text-white text-center mb-2 uppercase italic">
          {isLogin ? 'ACCESS ' : 'NEW '}
          <span className="text-[#39ff14]">{isLogin ? 'GRANTED?' : 'RECRUIT'}</span>
        </h1>
        <p className="text-center text-gray-500 text-xs font-orbitron uppercase tracking-widest mb-8">
          {isLogin ? 'Enter your secure credentials' : 'Register your gaming profile'}
        </p>

        <form onSubmit={handleAuth} className="space-y-6" autoComplete="off">
          {!isLogin && (
            <div>
              <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">Username</label>
              <input 
                type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
                placeholder="Elite_Gamer"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">{isLogin ? 'Username or Email' : 'Email Address'}</label>
            <input 
              type={isLogin ? 'text' : 'email'} 
              required 
              value={isLogin ? loginIdentifier : email} 
              onChange={(e) => isLogin ? setLoginIdentifier(e.target.value) : setEmail(e.target.value)}
              autoComplete="off"
              className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
              placeholder={isLogin ? "Operator ID" : "operator@elite.com"}
            />
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">Security Key</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 font-bold text-xs font-orbitron uppercase animate-pulse">{error}</p>}

          <button type="submit" className="w-full py-4 bg-[#39ff14] text-black font-orbitron font-black tracking-[0.2em] rounded-sm btn-3d uppercase">
            {isLogin ? 'AUTHORIZE' : 'INITIATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-12 text-center text-gray-500 text-xs font-orbitron">
          {isLogin ? "IDENTITY MISSING? " : "IDENTITY VERIFIED? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#39ff14] hover:underline uppercase font-bold"
          >
            {isLogin ? 'REGISTER HERE' : 'LOG IN HERE'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
