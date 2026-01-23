
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Order } from '../types';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const currentUser = storageService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setOrders(storageService.getUserOrders(currentUser.id));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-orbitron font-black text-white mb-8 uppercase tracking-tighter">UNAUTHORIZED ACCESS</h1>
        <p className="text-gray-500 mb-12 font-orbitron text-sm tracking-widest uppercase">PLEASE LOGIN TO VIEW YOUR TRANSACTION HISTORY</p>
        <button onClick={() => navigate('/auth')} className="px-12 py-5 bg-[#39ff14] text-black font-orbitron font-black btn-3d tracking-widest">LOGIN TO SYSTEM</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-orbitron font-black mb-2 uppercase tracking-tighter text-white italic">
            MY <span className="text-[#39ff14]">ORDERS</span>
          </h1>
          <div className="h-1 w-24 bg-[#39ff14] mb-4 mx-auto md:mx-0"></div>
          <p className="text-gray-500 tracking-[0.5em] text-[10px] font-bold uppercase italic">ENCRYPTED TRANSACTION LOGS</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
           <Link to="/shop" className="px-8 py-3 border border-[#39ff14]/50 text-[#39ff14] font-orbitron text-[10px] font-black tracking-widest uppercase hover:bg-[#39ff14] hover:text-black transition-all">SHOP MORE</Link>
           <Link to="/" className="px-8 py-3 border border-white/10 text-white font-orbitron text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all">BACK HOME</Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass p-24 text-center border border-white/5 rounded-sm bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="text-2xl font-orbitron font-black text-gray-500 mb-10 uppercase tracking-widest">NO DEPLOYMENTS DETECTED</h3>
          <Link to="/shop" className="inline-block px-12 py-5 bg-[#39ff14] text-black font-orbitron font-black btn-3d tracking-[0.2em] shadow-[0_0_30px_rgba(57,255,20,0.3)] uppercase">Initialize Order</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {orders.map(order => (
            <div key={order.id} className="glass p-8 md:p-10 border border-white/5 hover:border-[#39ff14]/20 transition-all rounded-sm relative overflow-hidden group shadow-2xl">
                <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                    <div>
                        <p className="text-[10px] font-orbitron text-[#39ff14] uppercase tracking-widest mb-1 font-black">LOG ID</p>
                        <p className="text-white font-mono text-lg font-bold">#{order.id}</p>
                    </div>
                    <div className={`px-5 py-2 rounded-sm font-orbitron text-[10px] font-black uppercase tracking-widest shadow-lg ${order.status === 'Done' ? 'bg-green-600/20 text-green-500' : 'bg-yellow-600/20 text-yellow-500 animate-pulse'}`}>
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                        <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest mb-1 font-bold">RECIPIENT</p>
                        <p className="text-white font-bold text-lg truncate">{order.robloxUsername}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest mb-1 font-bold">LOADOUT</p>
                        <p className="text-[#39ff14] font-orbitron font-black text-lg">{order.amount} UNITS</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest mb-1 font-bold">COST</p>
                        <p className="text-white font-bold text-lg">{order.totalPrice} BDT</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest mb-1 font-bold">PAYMENT</p>
                        <p className="text-white uppercase font-bold text-lg">{order.paymentMethod}</p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] gap-6">
                    <div className="flex flex-col items-center sm:items-start overflow-hidden w-full">
                        <span className="text-gray-600 font-orbitron uppercase tracking-widest mb-1">TRANSACTION HASH</span>
                        <span className="text-gray-400 font-mono text-sm truncate w-full text-center sm:text-left">{order.transactionId}</span>
                    </div>
                    <div className="text-right whitespace-nowrap">
                         <span className="text-gray-600 font-orbitron uppercase tracking-widest mb-1 block">STAMP</span>
                        <span className="text-gray-500 italic">{new Date(order.timestamp).toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#39ff14]/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-[#39ff14]/10 transition-all pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-24 p-12 glass border border-white/5 text-center bg-gradient-to-t from-white/5 to-transparent rounded-sm shadow-2xl">
        <h4 className="text-[#39ff14] font-orbitron font-black mb-4 uppercase tracking-[0.4em] text-xs italic">SYSTEM ANOMALY?</h4>
        <p className="text-gray-500 text-sm mb-10 font-light max-w-2xl mx-auto leading-relaxed italic">If your deployment status is 'DONE' but resources haven't arrived in your sector, initiate high-priority contact with Command via <a href="https://wa.me/8801947249756" className="text-[#39ff14] font-bold underline">WhatsApp (+8801947249756)</a>.</p>
        <div className="flex justify-center gap-8">
            <Link to="/" className="text-white/40 hover:text-[#39ff14] font-orbitron text-[10px] uppercase tracking-widest transition-all border-b border-white/5 hover:border-[#39ff14] pb-1">COMMAND BASE</Link>
            <Link to="/shop" className="text-white/40 hover:text-[#39ff14] font-orbitron text-[10px] uppercase tracking-widest transition-all border-b border-white/5 hover:border-[#39ff14] pb-1">REARM SECTOR</Link>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
