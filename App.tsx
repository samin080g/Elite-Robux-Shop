
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';
import Legal from './pages/Legal';
import Auth from './pages/Auth';
import { storageService } from './services/storageService';
import { User } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentUser, setCurrentUser] = useState<User | null>(storageService.getCurrentUser());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentSettings = storageService.getSettings();
    setSettings(currentSettings);
    
    if (currentSettings.logoUrl) {
      const img = new Image();
      img.src = currentSettings.logoUrl;
      img.onload = () => setLogoReady(true);
      img.onerror = () => setLogoReady(true); 
    } else {
      setLogoReady(true);
    }

    const timer = setTimeout(() => setIsLoading(false), 2000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const consent = localStorage.getItem('elite_cookie_consent');
    if (!consent) {
      setShowCookies(true);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    navigate('/');
  };

  const handleAuthSuccess = () => {
    setCurrentUser(storageService.getCurrentUser());
    setIsLoading(true); 
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  const acceptCookies = () => {
    localStorage.setItem('elite_cookie_consent', 'true');
    setShowCookies(false);
  };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[9999] p-4 text-center">
        <h1 className="text-3xl font-orbitron font-black text-white mb-4 uppercase">SYSTEM OFFLINE</h1>
        <button onClick={() => window.location.reload()} className="px-10 py-3 bg-[#39ff14] text-black font-orbitron font-black tracking-widest btn-3d">RECONNECT</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[9999] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #39ff14 3px)' }}></div>
        <div className="relative flex flex-col items-center">
            <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-[4px] md:border-[6px] border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
                <div className="z-10 bg-black rounded-full p-4 shadow-[0_0_30px_rgba(57,255,20,0.4)]">
                    {settings.logoUrl && logoReady ? (
                      <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain animate-pulse" />
                    ) : (
                      <div className="text-[#39ff14] font-orbitron font-black text-3xl md:text-4xl animate-pulse">E</div>
                    )}
                </div>
            </div>
            <div className="mt-8 text-center px-4">
                <h2 className="text-[#39ff14] font-orbitron font-black text-lg md:text-xl tracking-[0.3em] animate-pulse uppercase">INITIALIZING ELITE SHOP</h2>
            </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'main_admin');

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#39ff14] selection:text-black bg-[#050505]">
      {/* Floating Emergency Uplink Button */}
      <a 
        href="https://wa.me/8801947249756" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[2000] group"
      >
        <div className="relative flex items-center gap-3">
          <div className="bg-[#050505]/90 border border-[#39ff14]/50 p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.3)] group-hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] group-hover:border-[#39ff14] transition-all duration-500 animate-float">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#39ff14]" fill="currentColor" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </div>
          <span className="hidden md:block bg-[#39ff14] text-black font-orbitron font-black text-[10px] py-1 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest whitespace-nowrap shadow-[0_0_15px_#39ff14]">EMERGENCY UPLINK</span>
        </div>
      </a>

      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 h-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src={settings.logoUrl || "https://lh3.googleusercontent.com/d/19j3CzSflC7AUrmiWimrzTNVDhJvFIQs9=s0"} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
            <span className="text-sm md:text-xl font-orbitron font-black tracking-tighter uppercase whitespace-nowrap">ELITE ROBUX <span className="text-[#39ff14]">SHOP</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-orbitron text-xs tracking-widest uppercase transition-all hover:text-[#39ff14] ${location.pathname === '/' ? 'text-[#39ff14]' : 'text-gray-400'}`}>HOME</Link>
            <Link to="/shop" className={`font-orbitron text-xs tracking-widest uppercase transition-all hover:text-[#39ff14] ${location.pathname === '/shop' ? 'text-[#39ff14]' : 'text-gray-400'}`}>SHOP</Link>
            {currentUser && <Link to="/orders" className={`font-orbitron text-xs tracking-widest uppercase transition-all hover:text-[#39ff14] ${location.pathname === '/orders' ? 'text-[#39ff14]' : 'text-gray-400'}`}>MY ORDERS</Link>}
            {isAdmin && <Link to="/admin" className="px-4 py-1.5 border border-[#39ff14] text-[#39ff14] font-orbitron text-[10px] uppercase hover:bg-[#39ff14] hover:text-black transition-all">ADMIN PANEL</Link>}
            
            {currentUser ? (
              <button onClick={handleLogout} className="px-5 py-2 border border-red-500/50 text-red-500 font-orbitron text-[10px] tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all">LOGOUT</button>
            ) : (
              <Link to="/auth" className="px-6 py-2 bg-[#39ff14] text-black font-orbitron font-black text-[10px] tracking-widest uppercase btn-3d">SIGN UP / LOGIN</Link>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#050505]/98 backdrop-blur-2xl border-b border-white/10 p-8 flex flex-col gap-6 shadow-2xl items-center text-center">
            <Link to="/" className="font-orbitron text-xl tracking-[0.2em] uppercase text-white hover:text-[#39ff14]">HOME</Link>
            <Link to="/shop" className="font-orbitron text-xl tracking-[0.2em] uppercase text-white hover:text-[#39ff14]">SHOP</Link>
            {currentUser && <Link to="/orders" className="font-orbitron text-xl tracking-[0.2em] uppercase text-white hover:text-[#39ff14]">MY ORDERS</Link>}
            {isAdmin && <Link to="/admin" className="font-orbitron text-xl tracking-[0.2em] uppercase text-[#39ff14]">ADMIN PANEL</Link>}
            <div className="pt-6 border-t border-white/5 w-full">
              {currentUser ? (
                <button onClick={handleLogout} className="w-full py-4 border border-red-500 text-red-500 font-orbitron text-sm uppercase tracking-widest">LOGOUT</button>
              ) : (
                <Link to="/auth" className="block w-full py-4 bg-[#39ff14] text-black font-orbitron font-black text-sm uppercase tracking-widest">SIGN UP / LOGIN</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth onAuth={handleAuthSuccess} />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/refund" element={<Legal type="refund" />} />
        </Routes>
      </main>

      <footer className="bg-black border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-orbitron font-black tracking-tighter uppercase">ELITE ROBUX <span className="text-[#39ff14]">SHOP</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md italic">{settings.description}</p>
          </div>
          <div>
            <h4 className="text-[#39ff14] font-orbitron text-xs font-black tracking-widest mb-6 uppercase">Legal Protocols</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="text-gray-400 text-xs hover:text-white transition-colors uppercase tracking-widest">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 text-xs hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-400 text-xs hover:text-white transition-colors uppercase tracking-widest">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#39ff14] font-orbitron text-xs font-black tracking-widest mb-6 uppercase">Emergency Uplink</h4>
            <ul className="space-y-4">
              <li><a href="https://wa.me/8801947249756" target="_blank" rel="noreferrer" className="text-[#39ff14] text-xs hover:underline font-bold transition-colors uppercase tracking-widest">WhatsApp: +8801947249756</a></li>
              <li><Link to="/shop" className="text-gray-400 text-xs hover:text-white transition-colors uppercase tracking-widest">Robux Armory</Link></li>
              <li><Link to="/shop" className="text-gray-400 text-xs hover:text-white transition-colors uppercase tracking-widest">Gift Cards</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-gray-600 text-[10px] font-orbitron tracking-widest">© 2026 ELITE ROBUX SHOP • ALL RIGHTS RESERVED • NOT AFFILIATED WITH ROBLOX CORP.</p>
          <div className="flex gap-4 grayscale opacity-40">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Nagad_Logo.png" alt="Nagad" className="h-4 object-contain" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/BKash_Logo.svg/512px-BKash_Logo.svg.png" alt="bKash" className="h-4 object-contain" />
          </div>
        </div>
      </footer>

      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#050505] border-t border-[#39ff14]/30 p-4 md:p-6 z-[2000] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-xs font-orbitron tracking-wider text-center md:text-left">SYSTEM USES COOKIES TO OPTIMIZE YOUR PROCUREMENT EXPERIENCE. CONTINUE?</p>
            <button onClick={acceptCookies} className="px-8 py-2 bg-[#39ff14] text-black font-orbitron font-black text-[10px] uppercase btn-3d whitespace-nowrap">ACCEPT PROTOCOL</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
