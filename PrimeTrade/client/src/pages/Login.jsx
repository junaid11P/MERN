import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const authContext = useContext(AuthContext);
    const { login, isAuthenticated } = authContext;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setAlert(null);
        setIsLoading(true);
        const result = await login({ email, password });
        setIsLoading(false);

        if (result.success) {
            setAlert({ type: 'success', msg: 'Login successful! Redirecting...' });
        } else {
            setAlert({ type: 'error', msg: result.msg || 'Login failed' });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center pattern-bg font-sans overflow-hidden p-6 relative">

            {/* 3D Container */}
            <div className="relative w-full max-w-md perspective-1000">

                {/* Floating Decorative Cubes behind the form */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-float z-0 rotate-12"></div>
                <div className="absolute -bottom-12 -left-12 w-20 h-20 bg-blue-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-float-delayed z-0 -rotate-12"></div>

                {/* Main Login Card */}
                <div className="relative z-10 bg-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] -translate-x-2 -translate-y-2">

                    <div className="text-center mb-8">
                        <div className="inline-block p-4 mb-4 bg-black text-white text-3xl font-black border-4 border-transparent transform -rotate-3 hover:rotate-0 transition-transform">
                            P
                        </div>
                        <h2 className="text-4xl font-black text-black uppercase tracking-tighter transform scale-y-110">
                            Prime Task
                        </h2>
                        <p className="text-gray-600 mt-2 font-bold uppercase text-xs tracking-widest">Secure Access Terminal</p>
                    </div>

                    {alert && (
                        <div className={`mb-4 p-4 border-3 border-black font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {alert.type === 'success' ? '✅ ' : '⚠️ '} {alert.msg}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Inputs with "Focus Lift" effect */}
                        <div className="group">
                            <label className="mb-2 block text-sm font-black text-black uppercase">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="w-full border-3 border-black bg-gray-50 px-4 py-3 text-black font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                                placeholder="USER@EXAMPLE.COM"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="group">
                            <label className="mb-2 block text-sm font-black text-black uppercase">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full border-3 border-black bg-gray-50 px-4 py-3 text-black font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-press bg-black text-white border-black px-4 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-900 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Accessing...' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-bold text-black border-t-2 border-black pt-4">
                        NEW USER?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-1">
                            SIGNUP &rarr;
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;