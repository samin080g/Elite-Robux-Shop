
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storageService.getUsers();
    
    if (users.find(u => u.email === email)) {
      setError('Email already exists in system.');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      passwordHash: password, // Simplified for simulation
      role: users.length === 0 ? 'main_admin' : 'user', // First user is main admin
      createdAt: Date.now()
    };

    storageService.saveUser(newUser);
    storageService.login(newUser);
    onSignup();
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass p-10 neon-border">
        <h1 className="text-3xl font-orbitron font-black text-white text-center mb-2">NEW <span className="text-[#39ff14]">RECRUIT</span></h1>
        <p className="text-center text-gray-500 text-xs font-orbitron uppercase tracking-widest mb-8">Register your gaming profile</p>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
              placeholder="Player_One"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-orbitron uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 py-4 px-5 text-white focus:border-[#39ff14]/50 focus:outline-none transition-all font-orbitron"
              placeholder="contact@email.com"
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
            CREATE ACCOUNT
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-xs">
          Already a member? <Link to="/login" className="text-[#39ff14] hover:underline">Access Terminal</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
