import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Product, Event } from '../types';

const Shop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'robux' | 'cards'>('robux');
  const [customRobuxAmount, setCustomRobuxAmount] = useState<number>(100);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const currentUser = storageService.getCurrentUser();

  useEffect(() => {
    const allProducts = storageService.getProducts();
    const activeProducts = allProducts.filter(p => p.active);
    setProducts(activeProducts);
    
    const settings = storageService.getSettings();
    setActiveEvents(settings.events?.filter(e => e.active && e.targetDate > Date.now()) || []);
    
    const initialQuants: Record<string, number> = {};
    activeProducts.forEach(p => { 
      if (p.type === 'giftcard') initialQuants[p.id] = 1; 
    });
    setCardQuantities(initialQuants);
  }, []);

  const getProductPrice = (product: Product) => {
    const event = activeEvents.find(e => e.applicableProductIds?.includes(product.id));
    return event?.discountPercentage ? product.price * (1 - event.discountPercentage / 100) : product.price;
  };

  const handleBuyNow = (product: Product, selectedAmount: number, quantity: number = 1) => {
    if (!currentUser) { 
      navigate('/auth'); 
      return; 
    }
    const unitPrice = getProductPrice(product) * (product.type === 'robux' ? selectedAmount : 1);
    navigate('/checkout', { 
      state: { 
        productName: product.title, 
        amount: product.type === 'robux' ? selectedAmount : product.amount, 
        quantity, 
        pricePerUnit: unitPrice, 
        productId: product.id 
      } 
    });
  };

  const adjustRobux = (delta: number) => {
    setCustomRobuxAmount(prev => {
      const newVal = prev + delta;
      return Math.min(10000, Math.max(1, newVal));
    });
  };

  const adjustCardQuantity = (id: string, delta: number) => {
    setCardQuantities(prev => {
      const current = prev[id] || 1;
      const next = current + delta;
      return { ...prev, [id]: Math.min(10, Math.max(1, next)) };
    });
  };

  const robuxProduct = products.find(p => p.type === 'robux') || { price: 3.0, title: 'Robux', id: 'robux-custom' } as Product;
  const robuxPrice = getProductPrice(robuxProduct);
  const discount = activeEvents.find(e => e.applicableProductIds?.includes(robuxProduct.id))?.discountPercentage || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-orbitron font-black mb-3 uppercase flex flex-col items-center gap-2 italic">
          THE <span className="text-[#39ff14] neon-text">ARMORY</span>
        </h1>
        <div className="h-0.5 w-12 bg-[#39ff14] mx-auto mb-4"></div>
        <p className="text-[#39ff14] tracking-[0.4em] uppercase text-[9px] md:text-xs font-bold opacity-80 italic">ELITE ROBUX SHOP TERMINAL</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="p-1 bg-white/5 rounded-full flex border border-white/10 w-full max-w-sm shadow-xl">
          <button 
            onClick={() => setActiveTab('robux')} 
            className={`flex-1 px-5 py-3 rounded-full font-orbitron font-black text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'robux' ? 'bg-[#39ff14] text-black shadow-[0_0_15px_#39ff14]' : 'text-gray-500 hover:text-white'}`}
          >
            ROBUX
          </button>
          <button 
            onClick={() => setActiveTab('cards')} 
            className={`flex-1 px-5 py-3 rounded-full font-orbitron font-black text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'cards' ? 'bg-[#39ff14] text-black shadow-[0_0_15px_#39ff14]' : 'text-gray-500 hover:text-white'}`}
          >
            GIFT CARDS
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'robux' ? (
          <div className="flex flex-col items-center">
            <div className="glass relative p-8 md:p-10 border border-white/5 rounded-sm w-full max-w-lg text-center shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
              <h2 className="text-xl md:text-2xl font-orbitron font-black text-white mb-8 uppercase italic tracking-tighter">
                ROBUX <span className="text-[#39ff14]">LOADOUT</span>
              </h2>
              
              <div className="space-y-8">
                <div className="relative group p-6 bg-black/40 border border-white/5 rounded-sm">
                  <p className="text-[8px] font-orbitron text-gray-500 uppercase tracking-[0.3em] mb-4 italic">ADJUST PAYLOAD INTENSITY</p>
                  
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-full flex flex-col items-center">
                        <input 
                          type="number" 
                          value={customRobuxAmount} 
                          min="1"
                          max="10000"
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setCustomRobuxAmount(Math.min(10000, Math.max(0, val)));
                          }}
                          className="w-full bg-transparent text-5xl md:text-6xl font-orbitron font-black text-white text-center focus:outline-none italic drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]"
                        />
                        <div className="text-[#39ff14] font-orbitron font-black text-[9px] tracking-widest animate-pulse uppercase mt-1">RBX UNITS</div>
                    </div>

                    <div className="w-full flex items-center justify-between gap-4 px-2">
                        <button 
                          onClick={() => adjustRobux(-10)} 
                          className="w-10 h-10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] font-orbitron font-black text-xl hover:bg-[#39ff14] hover:text-black transition-all rounded-sm shadow-lg active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                        </button>

                        <div className="flex-grow group/slider relative py-2">
                            <input 
                              type="range" 
                              min="1" 
                              max="10000" 
                              step="1"
                              value={customRobuxAmount} 
                              onChange={(e) => setCustomRobuxAmount(parseInt(e.target.value))} 
                              className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#39ff14] hover:bg-white/10 transition-all border border-white/5"
                            />
                            <div className="flex justify-between mt-2 text-[7px] font-orbitron text-gray-600 uppercase tracking-widest font-black">
                                <span>1</span>
                                <span>10,000 MAX</span>
                            </div>
                        </div>

                        <button 
                          onClick={() => adjustRobux(10)} 
                          className="w-10 h-10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] font-orbitron font-black text-xl hover:bg-[#39ff14] hover:text-black transition-all rounded-sm shadow-lg active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#39ff14]/5 border border-[#39ff14]/20 rounded-sm">
                  <p className="text-gray-500 font-orbitron text-[8px] uppercase mb-1 tracking-[0.2em] italic">DEPLOYMENT COST</p>
                  <div className="text-3xl md:text-4xl font-orbitron font-black text-white tracking-tighter">
                    {Math.round(customRobuxAmount * robuxPrice).toLocaleString()} <span className="text-lg text-[#39ff14] italic">BDT</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleBuyNow(robuxProduct, customRobuxAmount)} 
                  className="w-full py-5 bg-[#39ff14] text-black font-orbitron font-black text-lg btn-3d shadow-[0_10px_30px_-10px_rgba(57,255,20,0.3)] tracking-[0.1em] uppercase italic"
                >INITIATE DEPLOYMENT</button>
              </div>

              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[#39ff14]/20 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#39ff14]/20 pointer-events-none"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.filter(p => p.type === 'giftcard').map(card => {
              const q = cardQuantities[card.id] || 1;
              const cardPrice = getProductPrice(card);
              return (
                <div key={card.id} className="glass group border border-white/5 rounded-sm overflow-hidden flex flex-col h-full hover:border-[#39ff14]/30 transition-all shadow-xl">
                  <div className="relative aspect-[9/16] overflow-hidden bg-black">
                    <img src={card.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt={card.title} />
                    <div className="absolute top-2 right-2 bg-[#39ff14] text-black font-orbitron font-black px-2 py-1 text-[9px] shadow-xl">{cardPrice} BDT</div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow text-center">
                    <h3 className="text-white font-orbitron font-black text-md mb-3 uppercase italic tracking-tighter truncate">{card.title}</h3>
                    
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <button onClick={() => adjustCardQuantity(card.id, -1)} className="w-7 h-7 border border-white/10 flex items-center justify-center text-white hover:bg-[#39ff14] hover:text-black transition-all rounded-sm shadow-md">-</button>
                        <span className="font-orbitron font-black text-md text-[#39ff14] w-8">{q}</span>
                        <button onClick={() => adjustCardQuantity(card.id, 1)} className="w-7 h-7 border border-white/10 flex items-center justify-center text-white hover:bg-[#39ff14] hover:text-black transition-all rounded-sm shadow-md">+</button>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={() => handleBuyNow(card, 1, q)} 
                        className="w-full py-3 bg-[#39ff14] text-black font-orbitron font-black text-[8px] btn-3d tracking-[0.1em] uppercase italic"
                      >REQUEST ACCESS</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;