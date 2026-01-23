
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === password); // Simplistic check for demo

    if (user) {
      storageService.login(user);
      onLogin();
      navigate('/');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass p-10 neon-border">
        <h1 className="text-3xl font-orbitron font-black text-white text-center mb-2">ACCESS <span className="text-[#39ff14]">GRANTED?</span></h1>
        <p className="text-center text-gray-500 text-xs font-orbitron uppercase tracking-widest mb-8">Enter your secure credentials</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
              placeholder="operator@elite.com"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">Security Key</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 font-bold text-xs font-orbitron uppercase animate-pulse">{error}</p>}

          <button type="submit" className="w-full py-4 bg-[#39ff14] text-black font-orbitron font-black tracking-[0.2em] rounded-sm btn-3d">
            LOGIN
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-xs">
          Not registered? <Link to="/signup" className="text-[#39ff14] hover:underline">Request Access Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
