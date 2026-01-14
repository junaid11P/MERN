import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Star, User, ChevronRight, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:5001/api' });

export default function UserPortal() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: `Hello ${auth?.user?.name || ''}! How can I assist you today?` }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleBook = async (provider) => {
        try {
            setLoading(true);
            const { data } = await api.post('/bookings/create', {
                userId: auth.user._id,
                providerId: provider._id,
                serviceType: provider.category,
                details: 'Requested via Unified Portal',
                price: provider.pricing.baseRate
            });
            setMessages(prev => [...prev, { role: 'ai', content: `Success! Booked ${provider.name}. Booking ID: ${data._id}` }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Booking failed.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        const userMsg = { role: 'user', content: query };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);
        try {
            const { data } = await api.post('/ai/query', { userId: auth.user._id, query });
            setMessages(prev => [...prev, { role: 'ai', content: data.analysis.suggestedResponse, providers: data.providers }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Connection error.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-portal theme-user min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8">
            <div className="chat-window bg-white rounded-[2.5rem] shadow-premium flex flex-col overflow-hidden border border-indigo-100" style={{ width: '100%', maxWidth: '1100px', height: '90vh' }}>
                <header className="p-6 md:px-10 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-100 relative">
                            AI
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-main tracking-tight">Infinite Assistant</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Online</span>
                                <span className="text-xs text-muted font-medium">• {auth?.user?.name || 'Guest'}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-xs"
                    >
                        <LogOut size={16} /> <span className="hidden md:inline">End Session</span>
                    </button>
                </header>

                <div className="messages-container flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/30">
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[75%] p-6 rounded-[2rem] shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 rounded-tl-none'}`}>
                                <p className="text-sm md:text-base leading-relaxed font-medium">{m.content}</p>
                                {m.providers && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                                        {m.providers.map(p => (
                                            <div key={p._id} className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:border-indigo-400 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-main text-lg">{p.name}</h4>
                                                        <p className="text-xs text-muted flex items-center gap-1.5 mt-1 font-medium"><MapPin size={14} className="text-indigo-500" /> {p.location.address}</p>
                                                    </div>
                                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold border border-amber-100 shadow-sm"><Star size={12} fill="currentColor" /> {p.rating}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/50">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Base Rate</span>
                                                        <span className="text-indigo-600 font-extrabold text-lg">₹{p.pricing.baseRate}</span>
                                                    </div>
                                                    <button onClick={() => handleBook(p)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                                        Book Appointment
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analysis in progress</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 md:p-8 bg-white border-t border-slate-100">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[1.5rem] p-2 focus-within:bg-white focus-within:border-indigo-500 focus-within:shadow-xl focus-within:shadow-indigo-500/10 transition-all group">
                            <div className="pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <MessageSquare size={20} />
                            </div>
                            <input
                                className="w-full bg-transparent p-4 outline-none text-main font-medium placeholder:text-slate-400"
                                placeholder="Ask me anything: 'Find a plumber nearby' or 'I need a taxi'..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all">
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-muted mt-4 font-bold uppercase tracking-[0.2em] opacity-50">Powered by Super Platform AI • Verified Services Only</p>
                    </form>
                </div>
            </div>
        </div>
    );
}
