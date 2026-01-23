
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { User, Order, SiteSettings, Product, OrderStatus, UserRole, Event } from '../types';

const Admin: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [securityError, setSecurityError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'orders' | 'users' | 'events'>('orders');
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [products, setProducts] = useState<Product[]>(storageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    type: 'giftcard',
    title: '',
    price: 0,
    amount: '',
    description: '',
    image: '',
    active: true
  });

  const [newEvent, setNewEvent] = useState({
    name: '',
    targetDate: '',
    targetTime: '',
    discount: 0,
    selectedProducts: [] as string[]
  });

  const currentUser = storageService.getCurrentUser();

  const refreshData = () => {
    setSettings(storageService.getSettings());
    setProducts(storageService.getProducts());
    setOrders(storageService.getOrders());
    setUsers(storageService.getUsers());
  };

  const handleSecurityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityCode === '474001') {
      setIsVerified(true);
      refreshData();
    } else {
      setSecurityError('OVERRIDE FAILED: UNAUTHORIZED CODE');
      setSecurityCode('');
      setTimeout(() => setSecurityError(''), 3000);
    }
  };

  // --- Product Management ---
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.image || !productForm.title) {
        alert("CRITICAL: Asset protocol missing Title or Image Uplink.");
        return;
    }
    
    const product: Product = {
      ...productForm as Product,
      id: editingProduct ? editingProduct.id : storageService.generateId('PROD'),
      active: productForm.active ?? true,
      amount: productForm.amount || 0,
      description: productForm.description || '',
      image: storageService.formatImageUrl(productForm.image || '')
    };
    
    storageService.saveProduct(product);
    setProductForm({
      type: 'giftcard',
      title: '',
      price: 0,
      amount: '',
      description: '',
      image: '',
      active: true
    });
    setEditingProduct(null);
    refreshData();
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setProductForm({
      type: 'giftcard',
      title: '',
      price: 0,
      amount: '',
      description: '',
      image: '',
      active: true
    });
  };

  const handleUpdateProductStatus = (p: Product) => {
    storageService.saveProduct({ ...p, active: !p.active });
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    if (!window.confirm('WARNING: Permanent deletion of asset. Continue?')) return;
    storageService.deleteProduct(id);
    refreshData();
  };

  // --- Event/Operation Management ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date(`${newEvent.targetDate}T${newEvent.targetTime}`).getTime();
    if (isNaN(timestamp)) {
        alert("Invalid Temporal Data");
        return;
    }
    const current = storageService.getSettings();
    const event: Event = {
        id: storageService.generateId('EVT'),
        name: newEvent.name,
        targetDate: timestamp,
        active: true,
        discountPercentage: newEvent.discount,
        applicableProductIds: newEvent.selectedProducts
    };
    storageService.saveSettings({ ...current, events: [...(current.events || []), event] });
    setNewEvent({ name: '', targetDate: '', targetTime: '', discount: 0, selectedProducts: [] });
    refreshData();
    alert("Live Operation Broadcasted Successfully.");
  };

  const toggleEventActive = (id: string) => {
    const current = storageService.getSettings();
    const updatedEvents = (current.events || []).map(e => e.id === id ? { ...e, active: !e.active } : e);
    storageService.saveSettings({ ...current, events: updatedEvents });
    refreshData();
  };

  const deleteEvent = (id: string) => {
    if (!window.confirm("Permanent purge of this operation?")) return;
    const current = storageService.getSettings();
    const updatedEvents = (current.events || []).filter(e => e.id !== id);
    storageService.saveSettings({ ...current, events: updatedEvents });
    refreshData();
  };

  // --- User Management ---
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.role === 'main_admin' && currentUser?.role !== 'main_admin') {
      alert("Encryption Error: Main Admin authority is locked.");
      return;
    }
    storageService.saveUser({ ...target, role: newRole });
    refreshData();
  };

  // --- Settings Management ---
  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    alert("System Configurations Synchronized.");
    refreshData();
  };

  const handleCarouselChange = (idx: number, val: string) => {
    const newImages = [...settings.carouselImages];
    newImages[idx] = storageService.formatImageUrl(val);
    setSettings({ ...settings, carouselImages: newImages });
  };

  const handleUpdateStatus = (id: string, s: OrderStatus) => {
    storageService.updateOrderStatus(id, s);
    refreshData();
  };

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto px-4 py-32">
        <div className="glass p-12 neon-border text-center shadow-2xl">
          <h2 className="text-2xl font-orbitron font-black text-white mb-8 uppercase italic tracking-tighter">SECURE TERMINAL</h2>
          <form onSubmit={handleSecurityCheck} className="space-y-6">
            <input 
              type="password" value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="PASS-KEY" 
              className={`w-full bg-black/60 border ${securityError ? 'border-red-500' : 'border-white/10'} py-4 px-4 text-center text-2xl tracking-[0.5em] text-white font-orbitron focus:outline-none focus:border-[#39ff14]/50 transition-all`}
            />
            {securityError && <p className="text-red-500 font-orbitron text-[10px] font-black uppercase italic animate-bounce">{securityError}</p>}
            <button type="submit" className="w-full py-4 bg-[#39ff14] text-black font-orbitron font-black tracking-widest btn-3d uppercase">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-black text-[#39ff14] uppercase italic tracking-tighter">ELITE <span className="text-white">COMMAND</span></h1>
          <p className="text-gray-500 font-orbitron text-[10px] tracking-[0.5em] uppercase italic opacity-70">Sector Control Interface</p>
        </div>

        <div className="flex bg-white/5 p-1 border border-white/10 overflow-x-auto w-full md:w-auto shadow-xl rounded-sm">
          {['orders', 'products', 'events', 'users', 'settings'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-orbitron text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#39ff14] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="glass p-8 md:p-12 border border-white/5 min-h-[700px] shadow-2xl relative overflow-hidden">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-orbitron font-black text-white mb-8 uppercase italic">Registered Identities</h2>
            <table className="w-full text-left">
              <thead className="text-[10px] font-orbitron text-[#39ff14] uppercase tracking-widest border-b border-white/10 italic">
                <tr>
                  <th className="p-6">Operator ID</th>
                  <th className="p-6">Designation</th>
                  <th className="p-6 text-right">Clearance Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="text-sm hover:bg-white/[0.01]">
                    <td className="p-6">
                      <div className="text-white font-black italic uppercase">{u.username}</div>
                      <div className="text-[10px] text-gray-600 font-mono truncate max-w-[150px]">{u.email}</div>
                    </td>
                    <td className="p-6 text-gray-500 font-mono text-[11px]">{u.id}</td>
                    <td className="p-6 text-right">
                      <select 
                        className="bg-black border border-white/10 text-[10px] p-2 font-orbitron font-black uppercase"
                        value={u.role}
                        disabled={u.role === 'main_admin' && currentUser?.role !== 'main_admin'}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                        <option value="main_admin">MAIN ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleSettingsUpdate} className="space-y-12">
            <h2 className="text-2xl font-orbitron font-black text-white mb-8 uppercase italic">System Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">STOREFRONT DESIGNATION</label>
                  <input 
                    type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})}
                    className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">MISSION DESCRIPTION</label>
                  <textarea 
                    value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})}
                    className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none h-32"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">LOGO UPLINK</label>
                  <input 
                    type="text" value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: storageService.formatImageUrl(e.target.value)})}
                    className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">FAVICON UPLINK</label>
                  <input 
                    type="text" value={settings.faviconUrl} onChange={e => setSettings({...settings, faviconUrl: storageService.formatImageUrl(e.target.value)})}
                    className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-orbitron font-bold text-white mb-6 tracking-widest uppercase">Visual Reel Array (Carousel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {settings.carouselImages.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <input 
                      type="text" value={img} onChange={e => handleCarouselChange(idx, e.target.value)}
                      placeholder={`Slide ${idx + 1} URL`}
                      className="w-full bg-black border border-white/10 p-3 text-white text-[10px] font-mono focus:border-[#39ff14] focus:outline-none"
                    />
                    <div className="aspect-video bg-black border border-white/5 rounded-sm overflow-hidden">
                      <img src={img} className="w-full h-full object-cover opacity-50" alt="" onError={e => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=EMPTY'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#39ff14] text-black font-orbitron font-black text-xs uppercase tracking-[0.5em] btn-3d italic">Sync Global Protocols</button>
          </form>
        )}

        {activeTab === 'events' && (
            <div className="space-y-12">
                <h2 className="text-2xl font-orbitron font-black text-white mb-8 uppercase italic">Operation Broadcast</h2>
                
                <form onSubmit={handleAddEvent} className="space-y-6 p-8 bg-[#39ff14]/5 border border-[#39ff14]/20 rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                          type="text" placeholder="Operation Alias" required
                          value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                          className="bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                        />
                        <input 
                          type="date" required
                          value={newEvent.targetDate} onChange={e => setNewEvent({...newEvent, targetDate: e.target.value})}
                          className="bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                        />
                        <input 
                          type="time" required
                          value={newEvent.targetTime} onChange={e => setNewEvent({...newEvent, targetTime: e.target.value})}
                          className="bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                        />
                        <input 
                          type="number" min="0" max="100" placeholder="Discount %" required
                          value={newEvent.discount} onChange={e => setNewEvent({...newEvent, discount: parseInt(e.target.value)})}
                          className="bg-black border border-white/10 p-4 text-[#39ff14] text-sm font-orbitron font-black focus:border-[#39ff14] focus:outline-none"
                        />
                    </div>

                    <div className="bg-black/40 border border-white/5 p-6">
                        <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest mb-4 italic">Target Assets:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products.map(p => (
                                <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={newEvent.selectedProducts.includes(p.id)}
                                        onChange={() => setNewEvent(prev => ({
                                            ...prev,
                                            selectedProducts: prev.selectedProducts.includes(p.id) 
                                                ? prev.selectedProducts.filter(id => id !== p.id) 
                                                : [...prev.selectedProducts, p.id]
                                        }))}
                                        className="w-4 h-4 accent-[#39ff14]"
                                    />
                                    <span className={`text-[10px] font-orbitron uppercase truncate transition-all ${newEvent.selectedProducts.includes(p.id) ? 'text-[#39ff14]' : 'text-gray-600 group-hover:text-gray-400'}`}>{p.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full py-4 bg-[#39ff14] text-black font-orbitron font-black text-[10px] uppercase tracking-[0.5em] btn-3d italic">Deploy Operation</button>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-orbitron text-[#39ff14] uppercase tracking-widest border-b border-white/10 italic">
                            <tr>
                                <th className="p-6">Operation</th>
                                <th className="p-6">Deadline</th>
                                <th className="p-6">Value</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(settings.events || []).map(evt => (
                                <tr key={evt.id} className="text-sm group hover:bg-white/[0.01]">
                                    <td className="p-6 font-black text-white uppercase italic">{evt.name}</td>
                                    <td className="p-6 text-gray-500 font-mono text-[11px]">{new Date(evt.targetDate).toLocaleString()}</td>
                                    <td className="p-6"><span className="text-[#39ff14] font-orbitron font-black">-{evt.discountPercentage}%</span></td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <button 
                                                onClick={() => toggleEventActive(evt.id)}
                                                className={`px-4 py-2 rounded-sm text-[8px] font-orbitron font-black uppercase transition-all shadow-lg ${evt.active ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                                            >
                                                {evt.active ? 'Active' : 'Offline'}
                                            </button>
                                            <button onClick={() => deleteEvent(evt.id)} className="p-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-12">
              <h2 className="text-2xl font-orbitron font-black text-white mb-8 uppercase italic">{editingProduct ? 'Update Asset' : 'Inventory Control'}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <form onSubmit={handleProductSubmit} className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">TYPE</label>
                      <select 
                         className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                         value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value as any})}
                      >
                         <option value="robux">Robux</option>
                         <option value="giftcard">Gift Card</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">TITLE</label>
                      <input 
                        type="text" placeholder="Product Alias" required
                        value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})}
                        className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">PRICE (BDT)</label>
                      <input 
                        type="number" placeholder="Cost BDT" required
                        value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                        className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">LOADOUT (UNITS)</label>
                      <input 
                        type="text" placeholder="Units per pack" required
                        value={productForm.amount} onChange={e => setProductForm({...productForm, amount: e.target.value})}
                        className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">IMAGE LINK (REEL SIZE - GOOGLE DRIVE SUPPORTED)</label>
                    <input 
                      type="text" placeholder="https://drive.google.com/..." required
                      value={productForm.image} onChange={e => setProductForm({...productForm, image: storageService.formatImageUrl(e.target.value)})}
                      className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest block mb-2">DESCRIPTION</label>
                    <textarea 
                      placeholder="Product details..."
                      value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                      className="w-full bg-black border border-white/10 p-4 text-white text-sm font-orbitron focus:border-[#39ff14] focus:outline-none h-24"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-[#39ff14] text-black font-orbitron font-black text-[10px] h-14 uppercase tracking-[0.3em] btn-3d italic">
                      {editingProduct ? 'UPDATE ASSET' : 'PUBLISH ASSET'}
                    </button>
                    {editingProduct && (
                      <button type="button" onClick={cancelEdit} className="px-8 h-14 border border-white/10 text-white font-orbitron font-black text-[10px] uppercase tracking-widest">
                        CANCEL
                      </button>
                    )}
                  </div>
                </form>

                <div className="flex flex-col items-center">
                   <p className="text-[8px] font-orbitron text-gray-500 uppercase tracking-widest mb-4">Live Reel Preview</p>
                  <div className="w-full max-w-[200px] aspect-[9/16] bg-black border border-white/10 rounded-sm overflow-hidden relative shadow-2xl">
                    {productForm.image ? (
                        <img 
                            src={productForm.image} 
                            className="w-full h-full object-cover" 
                            alt="Preview"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1080x1920?text=ASSET+LOAD+ERROR'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-800 text-[8px] font-orbitron text-center p-4">WAITING FOR ASSET UPLINK</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-orbitron text-[#39ff14] uppercase tracking-widest border-b border-white/10 italic">
                    <tr>
                      <th className="p-6">Asset</th>
                      <th className="p-6">Name</th>
                      <th className="p-6 text-center">Cost</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(p => (
                      <tr key={p.id} className="text-sm group hover:bg-white/[0.01]">
                        <td className="p-6">
                           <div className="w-12 aspect-[9/16] bg-black border border-white/10 rounded-sm overflow-hidden shadow-lg">
                              <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="P" />
                           </div>
                        </td>
                        <td className="p-6 font-black uppercase text-white italic">{p.title}</td>
                        <td className="p-6 text-center text-[#39ff14] font-orbitron font-black">{p.price} BDT</td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-3">
                            <button onClick={() => handleEditClick(p)} className="p-2 border border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-all rounded-sm" title="Edit Asset">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleUpdateProductStatus(p)} className={`px-4 py-2 rounded-sm text-[8px] font-orbitron font-black uppercase shadow-lg transition-all ${p.active ? 'bg-green-600 text-white' : 'bg-red-900/50 text-red-500 border border-red-500/30'}`}>
                                {p.active ? 'Active' : 'Offline'}
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm" title="Purge Asset">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-orbitron text-[#39ff14] uppercase tracking-widest border-b border-white/10 italic">
                <tr>
                  <th className="p-6">Uplink</th>
                  <th className="p-6">Target</th>
                  <th className="p-6">Asset</th>
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(o => (
                  <tr key={o.id} className="text-sm group hover:bg-white/[0.01]">
                    <td className="p-6 text-gray-500 font-mono text-xs">#{o.id}</td>
                    <td className="p-6">
                      <div className="text-white font-black italic uppercase">{o.robloxUsername}</div>
                      <div className="text-[10px] text-gray-600 font-mono">{o.phoneNumber}</div>
                    </td>
                    <td className="p-6 text-gray-300 font-orbitron text-xs truncate max-w-[150px]">{o.productName} ({o.amount})</td>
                    <td className="p-6 text-right">
                       <select 
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as any)}
                        className={`bg-black border border-white/10 text-[10px] p-2 font-orbitron font-black uppercase focus:outline-none transition-all rounded-sm ${o.status === 'Done' ? 'text-green-500 border-green-500/30' : 'text-yellow-500 border-yellow-500/30'}`}
                        value={o.status}
                       >
                         {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
