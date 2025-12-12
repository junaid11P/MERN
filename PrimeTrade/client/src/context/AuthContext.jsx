import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Initial State
// We check localStorage initially to keep the user logged in on refresh
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
};

// Reducer: Handles state transitions based on actions
const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            // Save token to localhost immediately
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'REGISTER_FAIL':
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            // Clean up on failure or logout
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initial Load User
    // If a token exists in state (from localStorage), set the header and fetch (load) the user
    useEffect(() => {
        if (state.token) {
            setAuthToken(state.token);
            loadUser();
        } else {
            // Need to stop loading if there is no token
            dispatch({ type: 'AUTH_ERROR' });
        }
        // eslint-disable-next-line
    }, []);

    // Load User Helper
    const loadUser = async () => {
        // Set the header again to be sure (especially after login)
        if (localStorage.token) {
            setAuthToken(localStorage.token);

            try {
                const res = await axios.get('http://localhost:5001/api/auth/user');
                dispatch({ type: 'USER_LOADED', payload: res.data });
            } catch (err) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        }
    };

    // Register User
    const register = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', formData, config);

            // 1. Dispatch success (updates local state)
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });

            // 2. Set Header manually for immediate subsequent requests
            setAuthToken(res.data.token);

            // 3. Load user data
            loadUser();
        } catch (err) {
            dispatch({
                type: 'REGISTER_FAIL',
                payload: err.response.data.msg
            });
        }
    };

    // Login User
    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', formData, config);

            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });

            // Critical: Set header immediately to avoid race conditions in loadUser
            setAuthToken(res.data.token);

            loadUser();
        } catch (err) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response.data.msg
            });
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null); // Clear the token from axios headers
        dispatch({ type: 'LOGOUT' });
    };

    // Update Password
    const updatePassword = async (newPassword) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.put('http://localhost:5001/api/auth/password', { newPassword }, config);
            return { success: true, msg: res.data.msg };
        } catch (err) {
            const msg = err.response && err.response.data.msg ? err.response.data.msg : 'Update failed';
            return { success: false, msg };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                register,
                login,
                logout,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Helper: Set global AXIOS header
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export default AuthContext;
