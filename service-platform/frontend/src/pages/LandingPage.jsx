import React, { useState } from 'react';
import { MessageSquare, Briefcase, ChevronRight, Zap, Globe, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [showAuth, setShowAuth] = useState(null);

    const handleRoleClick = (role) => {
        if (auth && auth.role === role) {
            navigate(role === 'user' ? '/chat' : `/${role}`);
        } else {
            setShowAuth(role);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-white">
            {/* Dynamic Background */}
            <div
                style={{
                    position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px',
                    background: 'rgba(79, 70, 229, 0.05)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none'
                }}
            />
            <div
                style={{
                    position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px',
                    background: 'rgba(16, 185, 129, 0.03)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none'
                }}
            />

            {/* Navigation */}
            <nav className="p-8 flex justify-between items-center relative z-10 max-w-7xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">S</div>
                    <h1 className="text-xl font-bold tracking-tighter text-main">SUPER PLATFORM</h1>
                </div>
                <button
                    onClick={() => handleRoleClick('admin')}
                    className="p-2 px-6 glass rounded-full text-xs font-bold hover:bg-white/80 transition-all cursor-pointer"
                >
                    Admin Access
                </button>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl px-8 pt-10 pb-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
                        <div className="flex items-center gap-2 max-w-max px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold">
                            <Zap size={14} /> NEXT GEN SERVICE ECOSYSTEM
                        </div>
                        <h2 className="hero-title">
                            One platform, <br />
                            <span className="text-gradient">Unlimited Services.</span>
                        </h2>
                        <p className="text-xl text-muted max-w-lg">
                            The world's most intelligent service platform. Use AI to find experts, manage your team, or scale your production.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => handleRoleClick('user')} className="btn-primary">
                                <MessageSquare size={20} /> Start Chatting
                            </button>
                            <button onClick={() => handleRoleClick('provider')} className="btn-secondary">
                                <Briefcase size={20} /> Join as Partner
                            </button>
                        </div>
                    </motion.div>

                    {/* AI Preview */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
                        <div className="preview-card p-8 rounded-[3rem] relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-200">AI</div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-main">Assistant Preview</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Live Engine</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="chat-bubble-ai p-5 rounded-3xl rounded-tl-none max-w-[90%] shadow-sm">
                                    <p className="text-sm font-medium">How can I help you today? I can find plumbers, electricians, or book transportation.</p>
                                </div>
                                <div className="chat-bubble-user p-5 rounded-3xl rounded-tr-none max-w-[85%] ml-auto shadow-md">
                                    <p className="text-sm font-medium">I need an expert electrician in New York for tomorrow morning.</p>
                                </div>
                                <div className="chat-bubble-ai p-5 rounded-3xl rounded-tl-none max-w-[90%] shadow-sm">
                                    <p className="text-sm font-medium mb-4">Searching 560+ verified electricians in NYC... Found 3 top-rated matches.</p>
                                    <div className="status-badge p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center shadow-sm">
                                                <Shield size={16} className="text-emerald-600" />
                                            </div>
                                            <span className="text-xs font-bold">Verified Pros Identified</span>
                                        </div>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50"></div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Auth Overlay */}
            <AnimatePresence>
                {showAuth && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="auth-overlay">
                        <div className="relative w-full max-w-lg mx-auto p-4">
                            <button
                                onClick={() => setShowAuth(null)}
                                className="absolute top-8 left-8 z-[1001] px-5 py-2.5 glass rounded-full text-xs font-bold text-gray-700 hover:bg-white transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                            >
                                <ChevronRight size={14} className="rotate-180" /> Back to Platform
                            </button>
                            <Auth role={showAuth} onSuccess={() => navigate(showAuth === 'user' ? '/chat' : `/${showAuth}`)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section className="bg-slate-50/50 border-y border-slate-100 py-24 relative z-10">
                <div className="max-w-7xl px-8 grid md:grid-cols-3 gap-16">
                    {[
                        { icon: Globe, title: 'Unified Experience', desc: 'One portal for users, service providers, and administrators with specialized dashboards.' },
                        { icon: Zap, title: 'AI Automation', desc: 'Advanced NLP understands complex requests and maps them to verified professionals instantly.' },
                        { icon: Shield, title: 'Secure Onboarding', desc: 'Mandatory 6-digit OTP verification ensures the highest security for all platform participants.' }
                    ].map((feat, i) => (
                        <div key={i} className="flex flex-col gap-6 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><feat.icon size={26} /></div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-bold text-main">{feat.title}</h4>
                                <p className="text-muted text-base leading-relaxed">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="bg-white pt-24 pb-12 relative z-10">
                <div className="max-w-7xl px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">S</div>
                                <h1 className="text-xl font-bold tracking-tighter text-main uppercase">Super Platform</h1>
                            </div>
                            <p className="text-muted max-w-sm">
                                Revolutionizing how services are discovered, booked, and managed through cutting-edge AI technology and verified provider networks.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6 text-main">Platform</h5>
                            <ul className="space-y-4 text-sm text-muted">
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Find Services</li>
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Become a Partner</li>
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">AI Assistant</li>
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Enterprise</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6 text-main">Company</h5>
                            <ul className="space-y-4 text-sm text-muted">
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">About Us</li>
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</li>
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</li>
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Contact</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-muted">© 2026 SUPER PLATFORM. All rights reserved.</p>
                        <div className="flex gap-8 text-sm font-bold text-main">
                            <span className="cursor-pointer hover:text-indigo-600">Twitter</span>
                            <span className="cursor-pointer hover:text-indigo-600">LinkedIn</span>
                            <span className="cursor-pointer hover:text-indigo-600">GitHub</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
