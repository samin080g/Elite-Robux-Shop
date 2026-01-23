import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService, IMG_ROBUX, IMG_GIFT_CARDS } from '../services/storageService';

const Countdown: React.FC<{ targetDate: number }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = targetDate - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) return <span className="text-red-500">EXPIRED</span>;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((timeLeft / (1000 * 60)) % 60);
  const secs = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex gap-4 font-orbitron font-black text-white italic">
      <div className="text-center">
        <span className="text-xl md:text-3xl block">{days.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-[#39ff14] uppercase">Days</span>
      </div>
      <span className="text-xl md:text-3xl">:</span>
      <div className="text-center">
        <span className="text-xl md:text-3xl block">{hours.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-[#39ff14] uppercase">Hours</span>
      </div>
      <span className="text-xl md:text-3xl">:</span>
      <div className="text-center">
        <span className="text-xl md:text-3xl block">{mins.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-[#39ff14] uppercase">Mins</span>
      </div>
      <span className="text-xl md:text-3xl">:</span>
      <div className="text-center">
        <span className="text-xl md:text-3xl block animate-pulse">{secs.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-[#39ff14] uppercase">Secs</span>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [settings] = useState(storageService.getSettings());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % settings.carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [settings.carouselImages.length]);

  const activeEvents = settings.events?.filter(e => e.active && e.targetDate > Date.now()) || [];

  return (
    <div className="relative overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-black">
        {settings.carouselImages.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-all duration-[1200ms] ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={img} className="w-full h-full object-cover brightness-75 scale-100 transition-transform duration-[10000ms]" alt={`Banner ${idx}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40"></div>
          </div>
        ))}
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl bg-black/30 backdrop-blur-sm p-6 md:p-12 rounded-lg border border-white/5">
              <div className="inline-block px-3 py-1 mb-4 border border-[#39ff14]/60 bg-[#39ff14]/10 rounded-sm">
                  <p className="text-[#39ff14] font-orbitron font-bold text-[8px] md:text-[10px] tracking-[0.6em] uppercase flex items-center gap-2">
                    SECURE HUB
                  </p>
              </div>
              
              <h1 className="text-3xl md:text-7xl font-orbitron font-black leading-tight mb-4 uppercase italic tracking-tighter text-white">
                {settings.name.split(' ')[0]} <span className="text-[#39ff14] drop-shadow-[0_0_10px_#39ff14]">{settings.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <p className="text-sm md:text-lg text-white max-w-2xl font-semibold mb-10 tracking-wider mx-auto uppercase opacity-90">
                {settings.description}
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                 <Link to="/shop" className="w-full sm:w-64 h-16 bg-[#39ff14] text-black transition-all transform hover:scale-105 flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.5)] font-orbitron font-black text-xl" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>
                    ENTER SHOP
                 </Link>
                 <div className="flex gap-4">
                    {settings.carouselImages.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 transition-all rounded-full ${idx === currentSlide ? 'w-10 bg-[#39ff14]' : 'w-2 bg-white/40'}`}></button>
                    ))}
                 </div>
              </div>
          </div>
        </div>
      </section>

      {/* Live Operations */}
      {activeEvents.length > 0 && (
        <section className="py-10 bg-black/40 border-y border-[#39ff14]/30">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#39ff14]/20 rounded-full flex items-center justify-center animate-pulse border border-[#39ff14]/50">
                <div className="w-6 h-6 bg-[#39ff14] rounded-sm"></div>
              </div>
              <h2 className="text-xl md:text-3xl font-orbitron font-black text-white italic uppercase">LIVE <span className="text-[#39ff14]">DROP</span></h2>
            </div>
            <div className="glass p-4 md:p-6 border border-[#39ff14]/40 rounded-sm">
               <Countdown targetDate={activeEvents[0].targetDate} />
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Link to="/shop" className="group relative h-[350px] md:h-[500px] overflow-hidden bg-[#111] border border-white/10 flex items-center justify-center rounded-sm transition-all hover:border-[#39ff14]/50">
               <img src={IMG_GIFT_CARDS} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Gift Cards" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <div className="relative z-10 text-center p-6">
                  <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white mb-2 uppercase flex flex-col items-center gap-2">
                    GIFT CARDS
                  </h2>
                  <p className="text-white font-orbitron text-[10px] tracking-[0.4em] uppercase font-bold drop-shadow-md">DIGITAL CODES</p>
               </div>
            </Link>
            
            <Link to="/shop" className="group relative h-[350px] md:h-[500px] overflow-hidden bg-[#111] border border-white/10 flex items-center justify-center rounded-sm transition-all hover:border-[#39ff14]/50">
               <img src={IMG_ROBUX} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Robux" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <div className="relative z-10 text-center p-6">
                  <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white mb-2 uppercase flex flex-col items-center gap-2">
                    ROBUX
                  </h2>
                  <p className="text-white font-orbitron text-[10px] tracking-[0.4em] uppercase font-bold drop-shadow-md">INSTANT TRANSFER</p>
               </div>
            </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;