import React, { useState, useEffect } from 'react';
import {
    BarChart3, Users, IndianRupee, ShieldCheck,
    Bell, LogOut
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import Auth from '../components/Auth';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api' });

export default function AdminPortal() {
    const { auth, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth?.role === 'admin') {
            fetchData();
        }
    }, [auth]);

    const fetchData = async () => {
        try {
            const [{ data: statsData }, { data: providersData }] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/providers')
            ]);
            setStats(statsData);
            setProviders(providersData);
        } catch (err) {
            console.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    if (!auth || auth.role !== 'admin') {
        return <Auth role="admin" onSuccess={() => window.location.reload()} />;
    }

    if (loading) return <div className="h-screen flex items-center justify-center text-violet-500 font-bold">Initializing Command Center...</div>;

    return (
        <div className={`theme-admin flex min-h-screen bg-[#020617]`}>
            <aside className="sidebar">
                <div className="flex items-center gap-3 mb-10 p-4">
                    <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center font-bold text-white shadow-xl">A</div>
                    <h2 className="text-xl font-bold">Admin Hub</h2>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                    {[
                        { icon: BarChart3, label: 'Analytics', active: true },
                        { icon: Users, label: 'Providers' },
                        { icon: ShieldCheck, label: 'Security' },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${item.active ? 'bg-violet-600/10 text-violet-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <item.icon size={20} />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4">
                    <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-red-400 hover:text-red-500 transition-all">
                        <LogOut size={20} />
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Platform Control</h1>
                    <div className="flex gap-4">
                        <button className="p-3 glass rounded-xl"><Bell size={20} /></button>
                        <div className="flex items-center gap-3 p-1 px-4 glass rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-violet-600"></div>
                            <span className="text-sm font-bold">System Root</span>
                        </div>
                    </div>
                </header>

                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Providers', value: stats?.totalProviders || 0, delta: '+12%', icon: Users },
                        { label: 'Revenue', value: `₹${stats?.totalRevenue || 0}`, delta: '+8%', icon: IndianRupee },
                        { label: 'Active Bookings', value: stats?.totalBookings || 0, delta: '+5%', icon: ShieldCheck },
                        { label: 'Completion Rate', value: '94%', delta: '+2%', icon: BarChart3 },
                    ].map((stat, i) => (
                        <div key={i} className="card glass p-6 rounded-3xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-violet-600/10 text-violet-600 rounded-xl"><stat.icon size={20} /></div>
                                <span className="text-xs font-bold text-emerald-500">{stat.delta}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="card glass p-8 rounded-3xl mb-10">
                    <h3 className="text-xl font-bold mb-8">Revenue Insights (Live)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats?.revenueData || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} />
                                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}
