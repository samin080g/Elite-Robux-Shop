
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAYMENT_NUMBERS } from '../constants';
import { PaymentMethod, OrderStatus, Order } from '../types';
import { storageService } from '../services/storageService';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = storageService.getCurrentUser();
  
  const productData = location.state || { 
    productName: 'Robux Package', 
    amount: 100, 
    quantity: 1, 
    pricePerUnit: 125 
  };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Nagad');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const total = Math.round(productData.pricePerUnit * productData.quantity);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (!agreed) {
      setError('Please accept the agreement to place order');
      return;
    }

    if (!username || !phone || !transactionId) {
      setError('All fields are required');
      return;
    }

    const order: Order = {
      id: `ELITE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: currentUser.id,
      productName: productData.productName,
      amount: productData.amount,
      quantity: productData.quantity,
      totalPrice: total,
      paymentMethod,
      transactionId,
      robloxUsername: username,
      phoneNumber: phone,
      status: OrderStatus.PENDING,
      timestamp: Date.now()
    };

    storageService.saveOrder(order);
    setShowConfirm(true);
  };

  const finalizeOrder = () => {
    navigate('/orders');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-orbitron font-black mb-8 uppercase">SECURE <span className="text-[#39ff14]">DEPLOYMENT</span></h1>
          
          <form onSubmit={handleOrder} className="space-y-6">
            <div className="glass p-8 neon-border">
              <h3 className="font-orbitron font-bold text-[#39ff14] mb-6 tracking-widest uppercase text-xs">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setPaymentMethod('Nagad')} className={`py-4 font-orbitron font-bold rounded-sm border transition-all ${paymentMethod === 'Nagad' ? 'bg-[#39ff14] text-black border-[#39ff14]' : 'border-white/10 text-gray-400'}`}>NAGAD</button>
                <button type="button" onClick={() => setPaymentMethod('bKash')} className={`py-4 font-orbitron font-bold rounded-sm border transition-all ${paymentMethod === 'bKash' ? 'bg-[#39ff14] text-black border-[#39ff14]' : 'border-white/10 text-gray-400'}`}>BKASH</button>
              </div>

              <div className="p-4 bg-white/5 rounded-sm border-l-4 border-[#39ff14]">
                <p className="text-gray-500 text-[10px] font-orbitron uppercase mb-1">Send money to</p>
                <p className="text-2xl font-orbitron text-white font-bold">{PAYMENT_NUMBERS[paymentMethod]}</p>
              </div>
            </div>

            <div className="glass p-8 neon-border space-y-4">
              <h3 className="font-orbitron font-bold text-[#39ff14] mb-4 tracking-widest uppercase text-xs">Operational Details</h3>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Roblox Username" className="w-full bg-black/40 border border-white/10 py-4 px-4 text-white font-orbitron focus:border-[#39ff14]/50 focus:outline-none" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your Phone Number" className="w-full bg-black/40 border border-white/10 py-4 px-4 text-white font-orbitron focus:border-[#39ff14]/50 focus:outline-none" />
              <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Transaction ID (TrxID)" className="w-full bg-black/40 border border-white/10 py-4 px-4 text-white font-orbitron focus:border-[#39ff14]/50 focus:outline-none" />

              <div className="pt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-5 h-5 accent-[#39ff14]" />
                  <span className="text-gray-500 text-xs font-light">I accept that money is not refundable after purchase</span>
                </label>
                {error && <p className="text-red-500 font-bold text-xs font-orbitron uppercase animate-pulse">{error}</p>}
              </div>

              <button type="submit" disabled={!agreed} className={`w-full py-5 font-orbitron font-black text-xl tracking-[0.2em] rounded-sm transition-all ${agreed ? 'bg-[#39ff14] text-black btn-3d shadow-[0_0_20px_#39ff14]' : 'bg-white/5 text-gray-700'}`}>CONFIRM DEPLOYMENT</button>
              
              <div className="text-center pt-4">
                <a href="https://wa.me/8801947249756" className="text-[10px] font-orbitron text-gray-600 hover:text-[#39ff14] transition-all uppercase tracking-widest italic">Emergency Issue? Contact Command via WhatsApp</a>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:sticky lg:top-32 h-fit">
          <div className="glass p-8 neon-border">
            <h3 className="font-orbitron font-bold text-white mb-6 tracking-widest uppercase text-xs border-b border-white/5 pb-4">ORDER SPECIFICATIONS</h3>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Resource:</span><span className="text-[#39ff14] font-orbitron font-bold uppercase">{productData.productName}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Loadout:</span><span className="text-white font-orbitron">{productData.amount} units</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Quantity:</span><span className="text-white font-orbitron">x{productData.quantity}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Method:</span><span className="text-white font-orbitron">{paymentMethod}</span></div>
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-xl font-orbitron text-white">TOTAL BDT</span>
                <span className="text-4xl font-orbitron text-[#39ff14] font-black">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
          <div className="max-w-md w-full glass p-10 neon-border text-center animate-float">
            <div className="w-20 h-20 bg-[#39ff14] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#39ff14]">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-3xl font-orbitron font-black text-white mb-4">DEPLOYED!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">Your request is being processed. For any emergency, WhatsApp: +8801947249756</p>
            <button onClick={finalizeOrder} className="w-full py-4 bg-[#39ff14] text-black font-orbitron font-bold rounded-sm btn-3d">VIEW LOGS</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
