import React, { useState } from 'react';
import {
    LayoutDashboard, Briefcase, Clock, Wallet, Settings, Bell,
    ChevronRight, MapPin, CheckCircle2, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Auth from '../components/Auth';

export default function ProviderPortal() {
    const { auth, logout } = useAuth();
    const [isOnline, setIsOnline] = useState(true);

    if (!auth || auth.role !== 'provider') {
        return <Auth role="provider" />;
    }

    return (
        <div className="provider-layout theme-provider">
            <aside className="sidebar">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">P</div>
                    <h2 className="text-xl font-bold">ProDesk</h2>
                </div>
                <nav className="flex-1 space-y-2">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', active: true },
                        { icon: Briefcase, label: 'My Jobs' },
                        { icon: Wallet, label: 'Earnings' },
                        { icon: Settings, label: 'Settings' },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${item.active ? 'bg-emerald-500/10 text-emerald-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <item.icon size={20} />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <button onClick={logout} className="flex items-center gap-4 p-4 text-red-400 hover:text-red-500 transition-all">
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </aside>

            <main className="main-content">
                <header className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Hello, {auth.user.name}!</h1>
                        <p className="text-gray-400">Your business is growing. You have 2 new requests.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className={`flex items-center gap-4 p-2 px-4 rounded-2xl glass`}>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                                <span className={`text-sm font-bold ${isOnline ? 'text-emerald-500' : 'text-red-500'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                            </div>
                            <button onClick={() => setIsOnline(!isOnline)} className={`w-12 h-6 rounded-full relative transition-all ${isOnline ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isOnline ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                        <button className="p-3 glass rounded-xl text-white"><Bell size={20} /></button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Earnings', value: '₹12,450', icon: Wallet, color: 'text-blue-400' },
                        { label: 'Jobs Done', value: '48', icon: CheckCircle2, color: 'text-emerald-400' },
                        { label: 'Rating', value: '4.9', icon: Clock, color: 'text-purple-400' },
                    ].map((stat, i) => (
                        <div key={i} className="card hover:-translate-y-1 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-2">{stat.label}</p>
                                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                                </div>
                                <div className={`p-3 bg-white/5 rounded-xl ${stat.color}`}><stat.icon size={24} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="card">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold">Active Requests</h2>
                        <button className="text-sm text-emerald-500 font-bold flex items-center gap-1">View All <ChevronRight size={14} /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Service</th>
                                    <th className="pb-4">Location</th>
                                    <th className="pb-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: 'John Doe', service: 'Deep Cleaning', loc: 'Downtown' },
                                    { name: 'Alice Smith', service: 'Plumbing', loc: 'West Side' },
                                ].map((job, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold">{job.name[0]}</div>
                                            <span className="font-semibold">{job.name}</span>
                                        </td>
                                        <td className="py-6 text-sm text-gray-300">{job.service}</td>
                                        <td className="py-6 text-sm text-gray-400"><div className="flex items-center gap-2"><MapPin size={14} /> {job.loc}</div></td>
                                        <td className="py-6"><button className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all">Accept Job</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
