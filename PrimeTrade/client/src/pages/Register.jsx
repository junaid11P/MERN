import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const authContext = useContext(AuthContext);
    const { register, isAuthenticated } = authContext;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const [alert, setAlert] = useState(null); // { type: 'success' | 'error', msg: '' }
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setAlert(null);

        if (password !== confirmPassword) {
            setAlert({ type: 'error', msg: 'Passwords do not match' });
            return;
        }

        setIsLoading(true);
        const result = await register({ name, email, password });
        setIsLoading(false);

        if (result.success) {
            setAlert({ type: 'success', msg: 'Account created successfully! Redirecting...' });
            // The useEffect will handle redirect, or we can delay slightly
        } else {
            setAlert({ type: 'error', msg: result.msg || 'Registration failed' });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center pattern-bg font-sans overflow-hidden p-6 relative">
            {/* 3D Container */}
            <div className="relative w-full max-w-md perspective-1000">
                {/* Floating Decorative Cubes */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-float z-0 rotate-12"></div>
                <div className="absolute -bottom-12 -left-12 w-20 h-20 bg-primary-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-float-delayed z-0 -rotate-12"></div>

                <div className="relative z-10 bg-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] -translate-x-2 -translate-y-2">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-black uppercase tracking-tight transform scale-y-110">
                            Join Prime Task
                        </h2>
                        <p className="text-gray-600 mt-2 font-bold uppercase text-xs tracking-widest">Create New Access ID</p>
                    </div>

                    {alert && (
                        <div className={`mb-4 p-4 border-3 border-black font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {alert.type === 'success' ? '✅ ' : '⚠️ '} {alert.msg}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="group">
                            <label className="mb-2 block text-sm font-black text-black uppercase">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full border-3 border-black bg-gray-50 px-4 py-3 text-black font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                                placeholder="JOHN DOE"
                                value={name}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="group">
                            <label className="mb-2 block text-sm font-black text-black uppercase">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full border-3 border-black bg-gray-50 px-4 py-3 text-black font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                                placeholder="USER@EXAMPLE.COM"
                                value={email}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="group">
                            <label className="mb-2 block text-sm font-black text-black uppercase">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full border-3 border-black bg-gray-50 px-4 py-3 text-black font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="group">
                            <label className="mb-2 block text-sm font-black text-black uppercase">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full border-3 border-black bg-gray-50 px-4 py-3 text-black font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-press bg-black text-white border-black px-4 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-900 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Creating Account...' : 'Signup'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-bold text-black border-t-2 border-black pt-4">
                        ALREADY HAVE AN ID?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-1">
                            LOGIN HERE &rarr;
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;