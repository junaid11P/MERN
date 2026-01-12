import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // { user, role, token }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem('service_platform_auth');
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        const endpoint = role === 'provider' ? '/providers/login' : '/users/login';
        const { data } = await axios.post(`http://localhost:5001/api${endpoint}`, { email, password });
        // Use backend returned role or requested role
        const authData = { user: data, role: data.role || role, token: data.token };
        setAuth(authData);
        localStorage.setItem('service_platform_auth', JSON.stringify(authData));
        return authData;
    };

    const signup = async (userData, role) => {
        const endpoint = role === 'provider' ? '/providers/signup' : '/users/signup';
        const { data } = await axios.post(`http://localhost:5001/api${endpoint}`, userData);
        const authData = { user: data, role, token: data.token };
        setAuth(authData);
        localStorage.setItem('service_platform_auth', JSON.stringify(authData));
        return authData;
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('service_platform_auth');
    };

    return (
        <AuthContext.Provider value={{ auth, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
