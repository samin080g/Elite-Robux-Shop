
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { Order } from '../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fixed: Use getOrders() as getAllOrders() does not exist in storageService
    setOrders(storageService.getOrders());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-orbitron font-black text-[#39ff14]">ADMIN <span className="text-white">DASHBOARD</span></h1>
        <div className="px-4 py-2 bg-white/5 border border-white/10 font-orbitron text-sm">TOTAL ENTRIES: {orders.length}</div>
      </div>

      <div className="glass overflow-x-auto neon-border">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/5 font-orbitron text-xs tracking-[0.2em] text-[#39ff14] uppercase border-b border-white/10">
              <th className="px-6 py-5 font-bold">User</th>
              <th className="px-6 py-5 font-bold">Product</th>
              <th className="px-6 py-5 font-bold">Amount</th>
              <th className="px-6 py-5 font-bold">Quantity</th>
              <th className="px-6 py-5 font-bold">Payment</th>
              <th className="px-6 py-5 font-bold">Transaction ID</th>
              <th className="px-6 py-5 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="text-white font-bold">{order.robloxUsername}</div>
                  <div className="text-xs text-gray-500 font-orbitron uppercase">{order.phoneNumber}</div>
                </td>
                <td className="px-6 py-5 text-gray-300 font-medium">{order.productName}</td>
                <td className="px-6 py-5 text-[#39ff14] font-orbitron">{order.amount}</td>
                <td className="px-6 py-5 text-gray-400">x{order.quantity}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 text-[10px] font-orbitron font-black uppercase rounded-sm ${order.paymentMethod === 'Nagad' ? 'bg-orange-600/20 text-orange-500' : 'bg-pink-600/20 text-pink-500'}`}>
                    {order.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-5 text-gray-400 font-mono text-sm">{order.transactionId}</td>
                <td className="px-6 py-5">
                  <div className={`flex items-center gap-2 font-orbitron text-[10px] font-bold tracking-widest uppercase ${order.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                    {order.status}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-gray-600 font-orbitron uppercase tracking-widest">No order data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
