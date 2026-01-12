import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, Loader2, CheckCircle2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Auth = ({ role, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', category: 'Plumbing'
    });
    const [timer, setTimer] = useState(0);

    const { login, signup } = useAuth();

    useEffect(() => {
        let interval;
        if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/auth/otp/send', { email: formData.email });
            setStep('otp');
            setTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const verifyRes = await axios.post('http://localhost:5001/api/auth/otp/verify', {
                email: formData.email,
                code: otpCode
            });

            if (verifyRes.data.success) {
                if (isLogin) {
                    await login(formData.email, formData.password, role);
                } else {
                    await signup(formData, role);
                }
                onSuccess?.();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Incorrect code.');
        } finally {
            setLoading(false);
        }
    };

    const themeClass = role === 'provider' ? 'theme-provider' : (role === 'admin' ? 'theme-admin' : 'theme-user');

    return (
        <div className={themeClass}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
            >
                <AnimatePresence mode="wait">
                    {step === 'form' ? (
                        <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div className="auth-header">
                                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                                <p>{isLogin ? `Sign in to your ${role} portal` : `Join the platform as a ${role}`}</p>
                            </div>

                            <form onSubmit={handleSendOTP} className="auth-form">
                                <AnimatePresence>
                                    {!isLogin && (
                                        <motion.div
                                            key="signup-fields"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex flex-col gap-0"
                                        >
                                            <div className="input-field-wrapped group">
                                                <User size={18} className="input-icon group-focus-within:text-indigo-500 transition-colors" />
                                                <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="input-field-wrapped group">
                                                <Phone size={18} className="input-icon group-focus-within:text-indigo-500 transition-colors" />
                                                <input type="text" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                            {role === 'provider' && (
                                                <div className="input-field-wrapped group">
                                                    <Briefcase size={18} className="input-icon group-focus-within:text-indigo-500 transition-colors" />
                                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                        <option value="Plumbing">Plumbing</option>
                                                        <option value="Carpentry">Carpentry</option>
                                                        <option value="Electrical">Electrical</option>
                                                        <option value="Cleaning">Cleaning</option>
                                                    </select>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="input-field-wrapped group">
                                    <Mail size={18} className="input-icon group-focus-within:text-indigo-500 transition-colors" />
                                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="input-field-wrapped group">
                                    <Lock size={18} className="input-icon group-focus-within:text-indigo-500 transition-colors" />
                                    <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>

                                {error && <p className="text-error">{error}</p>}

                                <button type="submit" disabled={loading} className="btn-auth-submit">
                                    {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Request Verification Code'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="auth-header">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-sm">
                                        <CheckCircle2 size={32} className="text-emerald-500" />
                                    </div>
                                </div>
                                <h2>Verify Identity</h2>
                                <p>Enter the 6-digit code sent to <br /><strong className="text-main">{formData.email}</strong></p>
                            </div>
                            <form onSubmit={handleVerifyAndSubmit} className="auth-form">
                                <div className="input-field-wrapped group">
                                    <Lock size={18} className="input-icon group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                        value={otpCode}
                                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                        className="text-center tracking-[0.5em] font-bold text-lg"
                                        autoFocus
                                    />
                                </div>
                                {error && <p className="text-error">{error}</p>}
                                <button type="submit" disabled={loading} className="btn-auth-submit">
                                    {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Verify & Sign In'}
                                </button>
                                <div className="mt-6 text-sm text-muted">
                                    {timer > 0 ? (
                                        <span className="font-medium">Resend code in <span className="text-main font-bold">{timer}s</span></span>
                                    ) : (
                                        <button type="button" onClick={handleSendOTP} className="text-main font-bold hover:underline cursor-pointer bg-transparent border-none p-0">Resend Code</button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step === 'form' && (
                    <div className="auth-footer">
                        <button onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Auth;
